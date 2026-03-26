#!/bin/bash
# Redirect wrapper to centralized build folder
bash "$(pwd)/scripts/build/$f" "$@"
