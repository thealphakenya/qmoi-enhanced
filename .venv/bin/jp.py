#!/workspaces/qmoi-enhanced/.venv/bin/python

import sys
import json
import argparse
from pprint import pformat

import jmespath
from jmespath import exceptions


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('expression')
    parser.add_argument('-f', '--filename',
                        help=('The filename containing the input data.  '
                              'If a filename is not given then data is '
                              'read from stdin.'))
    parser.add_argument('--ast', action='store_true',
                        help=('Pretty print the AST, do not search the data.'))
    args = parser.parse_args()
    expression = args.expression
    if args.ast:
        # Only print the AST
        expression = jmespath.compile(args.expression)
        sys.stdout.write(pformat(expression.parsed))
        sys.stdout.write('\n')
        return 0
    if args.filename:
        with open(args.filename, 'r') as f:
            data = json.load(f)
    else:
        data = sys.stdin.read()
        data = json.loads(data)
    try:
        sys.stdout.write(json.dumps(
            jmespath.search(expression, data), indent=4, ensure_ascii=False))
        sys.stdout.write('\n')
    except exceptions.ArityError as e:
        sys.stderr.write("invalid-arity: %s\n" % e)
        return 1
    except exceptions.JMESPathTypeError as e:
        sys.stderr.write("invalid-type: %s\n" % e)
        return 1
    except exceptions.UnknownFunctionError as e:
        sys.stderr.write("unknown-function: %s\n" % e)
        return 1
    except exceptions.ParseError as e:
        sys.stderr.write("syntax-error: %s\n" % e)
        return 1


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None


    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None


    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    sys.exit(main())
