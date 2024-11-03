vinxi COMMAND:
    npx vinxi {{COMMAND}}

prebuild:
    cp {{justfile_directory()}}/src/components/client-metadata.json {{justfile_directory()}}/public/

dev: prebuild
    just vinxi dev

build: prebuild
    just vinxi build

version:
    just vinxi version

preview: build
    wrangler pages dev

deploy: build
    wrangler pages deploy
        
deploy-main: build
    wrangler pages deploy --branch=main

check:
    # some nested dep has bad types...
    tsc --noEmit --watch --skipLibCheck

# test:
#     npx vitest --exclude ".direnv/**"
