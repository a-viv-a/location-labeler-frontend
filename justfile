vinxi COMMAND:
    npx vinxi {{COMMAND}}

prebuild:
    cp ./src/components/client-metadata.json ./public/

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

check:
    # some nested dep has bad types...
    tsc --noEmit --watch --skipLibCheck

# test:
#     npx vitest --exclude ".direnv/**"
