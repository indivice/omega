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