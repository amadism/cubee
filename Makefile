.PHONY: app
app: 
		BUILDX_EXPERIMENTAL=1 docker build \
		-f Dockerfile \
		--build-arg APP_NAME=app \
		--build-arg NPMRC_FILE=.npmrc \
		--platform linux/amd64 \
		-t europe-west3-docker.pkg.dev/cubee-expert/cubee/app:main .
		docker push europe-west3-docker.pkg.dev/cubee-expert/cubee/app:main
