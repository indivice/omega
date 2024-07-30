tsc -p ./tsconfig.json
cd dist

terser index.js --output index.js --keep_fnames
terser driver.js --output driver.js --keep_fnames
terser components.js --output components.js --keep_fnames
terser type.js --output type.js --keep_fnames

cd ..
cp -f ./src/package.json ./dist/package.json
cp -f ./README.md ./dist/README.md

cd dist

npm publish --access public

cd ..

#!/bin/bash

# Use Python to read the JSON file and extract the "version" field
version=$(python3 - <<END
import json
import sys

# Path to the JSON file
file_path = './src/package.json'

# Open and read the JSON file
with open(file_path, 'r') as file:
    data = json.load(file)

# Get the "version" field
version = data.get('version', 'No version found')

# Print the version
print(version)
END
)

# Print the version in Bash
echo "Uplaoded OmegaJS $version"
cd ts
npm i @indivice/omega@$version
cd ..
cd js
npm i @indivice/omega@$version