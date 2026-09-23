# Root Makefile forwarding to gclms/

%:
	@$(MAKE) -C gclms $@

.PHONY: help setup up down logs migrate seed test lint format clean
help setup up down logs migrate seed test lint format clean:
	@$(MAKE) -C gclms $@
