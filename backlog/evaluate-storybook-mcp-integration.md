---
status: ready
---

# Evaluate Storybook MCP integration

## Context

Storybook was initialized in this repository on version `10.3.6`, before the installer offered the later automatic
AI/MCP setup flow. The MCP addon was already available as an optional manual integration, but it was not selected or
added, and subsequent Storybook upgrades only updated the existing dependency set.

Current Storybook releases can expose component manifests, documentation, story-authoring guidance, previews, and
focused component and accessibility tests to compatible agents through `@storybook/addon-mcp`. This may improve the
existing agent-assisted component workflow, but the preview-stage API, local server connection, project instructions,
and ongoing maintenance cost should be evaluated before making it part of the repository contract.

## Outcome

- Decide whether Storybook MCP provides enough value for the repository's component and story workflow.
- If accepted, install and pin the addon, register it in Storybook, configure a project-scoped agent connection and
  focused instructions, and verify documentation discovery, story guidance, previews, and test execution.
- If rejected, leave the dependency and configuration absent and preserve the reason in an appropriate durable source.

## Next step

Run a focused local evaluation against the current Storybook using the official MCP setup, toolset, and manifest
documentation, then record the recommendation before changing dependencies or agent instructions.

## References

- [Storybook MCP server](https://storybook.js.org/docs/ai/mcp/overview)
- [Storybook manifests](https://storybook.js.org/docs/ai/manifests)
- [Storybook agentic setup](https://storybook.js.org/docs/ai/setup)
