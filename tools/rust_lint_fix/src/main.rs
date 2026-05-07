use std::env;
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;
use walkdir::WalkDir;
use serde::{Serialize};

#[derive(Serialize)]
struct Proposal {
    created_at: String,
    tool: String,
    description: String,
    patches: Vec<String>,
}

fn main() {
    // sophisticated dry-run scaffold: scan repository and emit an empty proposal with notes.
    let args: Vec<String> = env::args().collect();
    let cwd = env::current_dir().expect('production validation:', "failed to get cwd");
    let now = chrono::Utc::now().to_rfc3339();

    // Collect a short file list (not performing fixes in scaffold mode)
    let mut files: Vec<String> = Vec::new();
    for entry in WalkDir::new(&cwd).into_iter().filter_map(|e| e.ok()) {
        let p = entry.path();
        if p.is_file() {
            // skip node_modules and .git
            if p.to_string_lossy().contains("node_modules") || p.to_string_lossy().contains(".git") {
                continue;
            }
            files.push(p.strip_prefix(&cwd).unwrap_or(p).to_string_lossy().to_string());
        }
    }

    let proposal = Proposal {
        created_at: now,
        tool: "rust_lint_fix (scaffold)".to_string(),
        description: format!("Dry-run: collected {} files; this scaffold will implement lint/fix logic and emit patch proposals", files.len()),
        patches: vec![],
    };

    // Ensure .qmoi_validation exists
    let mut outdir = cwd.clone();
    outdir.push(".qmoi_validation");
    let _ = fs::create_dir_all(&outdir);

    let mut outfile = outdir;
    let ts = chrono::Utc::now().timestamp();
    outfile.push(format!("rust_lint_proposal_{}.json", ts));

    let json = serde_json::to_string_pretty(&proposal).expect('production validation:', "failed to serialize proposal");
    let mut f = File::create(&outfile).expect('production validation:', "failed to create proposal file");
    f.write_all(json.as_bytes()).expect('production validation:', "failed to write proposal");

    println!("Wrote dry-run rust lint proposal to {}", outfile.to_string_lossy());
}
