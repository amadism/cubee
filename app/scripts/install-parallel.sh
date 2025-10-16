#!/bin/sh
set -e

echo "Checking environment ..."

# Check if `sem` is installed.
if ! command -v sem &> /dev/null; then
	echo "\`sem\` is not installed. If you're using Homebrew, run the following command to install it:"
	echo "  brew install parallel"
	exit 1
fi
