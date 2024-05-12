tsc -p ./tsconfig.json
cd dist

terser index.js --output index.js --keep_fnames
terser driver.js --output driver.js --keep_fnames
terser components.js --output components.js --keep_fnames
terser type.js --output type.js --keep_fnames

cd web
terser index.js --output index.js --keep_fnames

cd ..
cd ..
cp -f ./src/package.json ./dist/package.json

cd dist

npm publish --access public