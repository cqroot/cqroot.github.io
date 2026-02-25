.PHONY: check
check:
	prettier -c content

.PHONY: server
server:
	hugo server --minify

.PHONY: clean
clean:
	rm -rf '$(CURDIR)/public/'
	rm -rf '$(CURDIR)/resources/'
