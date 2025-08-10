// scripts/convert-require-to-import.cjs
import fs from 'fs';
import path from 'path';
import recast from 'recast';
import { parse } from '@babel/parser';

const projectRoot = process.argv[2] || '.';

const parserOptions = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'jsx',
    'classProperties',
    'dynamicImport',
    'optionalChaining',
    'nullishCoalescingOperator',
    'decorators-legacy',
  ],
};

function parseCode(code) {
  return recast.parse(code, {
    parser: {
      parse(source) {
        return parse(source, parserOptions);
      },
    },
  });
}

function processFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');

  if (!code.includes('require(')) {
    return; // no require calls, skip
  }

  // Backup original
  const backupPath = filePath + '.bak';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  const ast = parseCode(code);
  let transformed = false;

  recast.types.visit(ast, {
    visitCallExpression(path) {
      const { node } = path;
      // Match require calls: require('module')
      if (
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        node.arguments.length === 1 &&
        node.arguments[0].type === 'StringLiteral'
      ) {
        // Parent node could be VariableDeclarator or MemberExpression or ExpressionStatement
        const parent = path.parentPath.node;

        if (
          parent.type === 'VariableDeclarator' &&
          parent.id.type === 'Identifier'
        ) {
          // const X = require('mod')
          // Replace with import X from 'mod';
          const importDecl = recast.types.builders.importDeclaration(
            [
              recast.types.builders.importDefaultSpecifier(
                recast.types.builders.identifier(parent.id.name)
              ),
            ],
            recast.types.builders.stringLiteral(node.arguments[0].value)
          );

          // Replace parent VariableDeclaration with ImportDeclaration
          const varDecl = path.parentPath.parentPath;
          varDecl.replace(importDecl);
          transformed = true;
          return false;
        }

        if (
          parent.type === 'VariableDeclarator' &&
          parent.id.type === 'ObjectPattern'
        ) {
          // const {a,b} = require('mod')
          const importSpecifiers = parent.id.properties.map((prop) => {
            if (prop.type === 'ObjectProperty') {
              return recast.types.builders.importSpecifier(
                recast.types.builders.identifier(prop.key.name)
              );
            }
            return null;
          }).filter(Boolean);

          const importDecl = recast.types.builders.importDeclaration(
            importSpecifiers,
            recast.types.builders.stringLiteral(node.arguments[0].value)
          );

          const varDecl = path.parentPath.parentPath;
          varDecl.replace(importDecl);
          transformed = true;
          return false;
        }

        if (
          parent.type === 'MemberExpression' &&
          path.parentPath.parentPath.node.type === 'VariableDeclarator'
        ) {
          // const x = require('mod').prop
          // Transform to import * as mod from 'mod';
          // Then usage x = mod.prop (left as is)
          // But we can't safely rewrite that in one step,
          // so import * as mod and leave variable declaration separately

          const varDecl = path.parentPath.parentPath.parentPath;
          const varDeclarator = path.parentPath.parentPath.node;

          // Find module name and variable name
          const moduleName = node.arguments[0].value;
          const varName = varDeclarator.id.name;

          // Generate a unique namespace import name
          const namespaceName = '_' + varName + '_mod';

          // Insert import * as _var_mod from 'mod';
          const importDecl = recast.types.builders.importDeclaration(
            [recast.types.builders.importNamespaceSpecifier(
              recast.types.builders.identifier(namespaceName)
            )],
            recast.types.builders.stringLiteral(moduleName)
          );

          // Replace the whole variable declarator initializer to namespace access
          varDeclarator.init = recast.types.builders.memberExpression(
            recast.types.builders.identifier(namespaceName),
            recast.types.builders.identifier(parent.property.name)
          );

          // Insert import above variable declaration
          varDecl.insertBefore(importDecl);

          transformed = true;
          this.traverse(path);
          return false;
        }

        if (parent.type === 'ExpressionStatement') {
          // require('mod');  (side effect import)
          const importDecl = recast.types.builders.importDeclaration(
            [],
            recast.types.builders.stringLiteral(node.arguments[0].value)
          );

          path.parentPath.replace(importDecl);
          transformed = true;
          return false;
        }
      }

      this.traverse(path);
    },
  });

  if (transformed) {
    const output = recast.print(ast).code;
    fs.writeFileSync(filePath, output, 'utf-8');
    console.log(`Converted require to import in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(projectRoot);
