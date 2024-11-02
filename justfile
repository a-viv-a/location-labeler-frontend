vinxi COMMAND:
    npx vinxi {{COMMAND}}

dev:
    just vinxi dev

build:
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
