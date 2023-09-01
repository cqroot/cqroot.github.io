.PHONY: tree
tree:
	@tree -I stylesheets $(CURDIR)/docs/

.PHONY: serve
serve:
	mkdocs serve
