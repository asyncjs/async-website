post:
	@./bin/newpost

serve:
	@which bundle || echo "Bundler not found: See install instructions in README.md"; exit 1
	@bundle check >/dev/null || bundle install
	@bundle exec jekyll serve --watch --port 4000

.PHONY: post serve
