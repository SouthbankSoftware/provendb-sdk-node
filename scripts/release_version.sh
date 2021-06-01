#/bin/bash

# First run the tests
npm run test
status=$?

if test $status -ne 0
then
    echo "test failed"
	exit status
fi

# Get the branch name
branch=$(git branch --show-current | sed s/release\\/v//)

# Update the version
npm version $branch

# Publish
npm publish