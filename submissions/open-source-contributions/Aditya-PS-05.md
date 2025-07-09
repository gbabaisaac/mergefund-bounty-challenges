# Open Source Contribution - Aditya-PS-05

## Contributor Information
- **Name**: Aditya Pratap Singh
- **GitHub**: @Aditya-PS-05
- **Submission ID**: Aditya-PS-05

## Contribution Details

### Project
**Astral.sh - uv**
- **Repository**: https://github.com/astral-sh/uv
- **Description**: An extremely fast Python package and project manager, written in Rust

### Issue Fixed
**GitHub Issue**: https://github.com/astral-sh/uv/issues/7365
**Pull Request**: https://github.com/astral-sh/uv/pull/7387

### Problem Description
The issue (#7365) requested adding support for remaining pip-supported file extensions in uv's source distribution handling. Previously, uv only supported a limited set of archive formats, but pip supports additional compression formats like `.tbz`, `.tgz`, `.txz`, `.tar.lz`, `.tar.lzma` that weren't recognized by uv. This created compatibility issues when working with packages distributed in these formats.

### Solution Implemented
The pull request (#7387) added support for the following additional file extension aliases:
- `.tbz` (bzip2 tarball alias)
- `.tgz` (gzip tarball alias)  
- `.txz` (xz tarball alias)
- `.tlz` (lzip tarball alias)
- `.tar.lz` (lzip tarball)
- `.tar.lzma` (lzma tarball)
- `.tar` (uncompressed tarball)

**Key Changes Made:**
1. Updated `SourceDistExtension` enum to include new variants (`TarLzma`, `Tar`)
2. Modified extension parsing logic to recognize new aliases
3. Enhanced error messages to reflect all supported extensions
4. Updated extraction logic to handle new compression formats
5. Added comprehensive test coverage for new extensions
6. Updated documentation to reflect supported formats

**Files Modified (7 files, +50 -19 lines):**
- `crates/distribution-filename/src/extension.rs` - Core extension handling
- `crates/requirements-txt/src/lib.rs` - Error message updates
- `crates/uv-extract/src/stream.rs` - Archive extraction logic
- `crates/uv/tests/build.rs` - Test updates
- `crates/uv/tests/pip_compile.rs` - Test updates
- `crates/uv/tests/pip_install.rs` - Test updates
- `docs/concepts/resolution.md` - Documentation updates

### Learning Experience
Contributing to Astral.sh's uv project provided valuable experience in:
- Working with Rust-based tools for Python package management
- Understanding archive format handling and compression libraries
- Following Rust coding conventions and error handling patterns
- Writing comprehensive tests for new functionality
- Collaborating with maintainers in a professional open-source environment
- Understanding Python packaging ecosystem compatibility requirements

### Impact
This contribution enhances uv's compatibility with the broader Python packaging ecosystem by supporting all pip-compatible archive formats. This helps developers who distribute packages in various compression formats and improves uv's adoption by reducing friction when migrating from pip.

### Test Plan
Updated existing tests and added new test cases to verify:
- New extensions are correctly recognized as valid source distributions
- Errors are properly raised for unsupported extensions
- Extraction logic works correctly for new archive formats
- All existing functionality remains intact

### Status
✅ **MERGED** - The pull request was successfully merged into the main repository on September 15, 2024, after thorough review by @charliermarsh.

---

*This submission is part of the MergeFund Open Source Issue Challenge.*