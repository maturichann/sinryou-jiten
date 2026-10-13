# Dependency update review

Routine version updates are limited to SemVer minor/patch releases, checked weekly,
with at most one open version-update PR per ecosystem. Only those routine updates
are grouped. A minor/patch label is not a compatibility guarantee (including 0.x).

`allow.update-types` restricts version updates only. Security updates remain
eligible, including fixes requiring a major parent-dependency upgrade. We do not
use a blanket `ignore` rule or dismiss alerts to hide incompatible security fixes.
Coupled parent/transitive fixes may appear together in one security PR; this does
not mean the application has been migrated or that the PR is safe to merge.

Before merging any dependency PR:

- Review the complete manifest/lockfile diff, including transitive and framework
  changes, release notes, and any required migration.
- Require successful relevant build/type/lint/unit checks on the current head.
  A failed, skipped, missing, or inconclusive check is not approval. A successful
  Preview is not proof that production integrations or business flows work.
- Keep incompatible or unvalidated updates open/unmerged for individual review.
  Keep the vulnerability visible and assess its exposure and mitigation separately.
  A major-only security fix requires a separately reviewed migration, not an
  automatic upgrade. Do not approve simply because another project check passes.
- Run only reviewed tests without production credentials, payments, trading,
  external posting, business automation, seed, migration, or deployment commands.
  If safe validation is unavailable, leave the update on hold and record the gap.

No auto-merge is configured here. This checklist and CI are review signals, not
enforced branch protection: a person with merge rights can still bypass them.
No setting can guarantee zero compatibility errors. Unpinned dependencies and
missing lockfiles also limit reproducibility and transitive coverage.

The Dependabot policy becomes active only after this configuration reaches the
default branch. Existing dependency PRs are not retroactively made safe. Security
alerts and repository-level security-update settings are managed separately and
are unchanged by this PR revision.

References:
- https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/controlling-dependencies-updated
- https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates
