import { execSync } from 'node:child_process';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('CLI', () => {
  const cli = 'node dist/cli.js';
  let tempFile: string;

  beforeEach(() => {
    // Create a temporary test file
    tempFile = join(tmpdir(), `mdtest-test-${Date.now()}.md`);
  });

  afterEach(() => {
    // Clean up temp file
    if (existsSync(tempFile)) {
      unlinkSync(tempFile);
    }
  });

  it('should show help with --help flag', () => {
    const output = execSync(`${cli} --help`, { encoding: 'utf-8' });
    expect(output).toContain('mdtest - Parse markdown test files to JSON');
    expect(output).toContain('Usage:');
    expect(output).toContain('Options:');
  });

  it('should show help with -h flag', () => {
    const output = execSync(`${cli} -h`, { encoding: 'utf-8' });
    expect(output).toContain('mdtest - Parse markdown test files to JSON');
  });

  it('should show version with --version flag', () => {
    const output = execSync(`${cli} --version`, { encoding: 'utf-8' });
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should error when no files provided', () => {
    try {
      execSync(cli, { encoding: 'utf-8', stdio: 'pipe' });
      expect.fail('Should have thrown an error');
    } catch (error) {
      const e = error as { stderr: string; status: number };
      expect(e.stderr).toContain('Error: No files specified');
      expect(e.stderr).toContain('Usage: mdtest [options] <files...>');
      expect(e.status).toBe(1);
    }
  });

  it('should parse a single file', () => {
    const content = '### Test\n<input>hello</input>\n<output>world</output>';
    writeFileSync(tempFile, content);

    const output = execSync(`${cli} ${tempFile}`, { encoding: 'utf-8' });
    const result = JSON.parse(output);

    expect(result).toEqual({
      tests: [
        {
          name: 'Test',
          input: 'hello',
          output: 'world',
        },
      ],
    });
  });

  it('should parse multiple files as array', () => {
    const tempFile2 = join(tmpdir(), `mdtest-test2-${Date.now()}.md`);

    writeFileSync(tempFile, '### Test1\n<input>a</input>\n<output>b</output>');
    writeFileSync(tempFile2, '### Test2\n<input>c</input>\n<output>d</output>');

    try {
      const output = execSync(`${cli} ${tempFile} ${tempFile2}`, {
        encoding: 'utf-8',
      });
      const result = JSON.parse(output);

      expect(result).toHaveLength(2);
      expect(result[0].tests[0].name).toBe('Test1');
      expect(result[1].tests[0].name).toBe('Test2');
    } finally {
      if (existsSync(tempFile2)) {
        unlinkSync(tempFile2);
      }
    }
  });

  it('should handle file not found error', () => {
    try {
      execSync(`${cli} /nonexistent/file.md`, {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      expect.fail('Should have thrown an error');
    } catch (error) {
      const e = error as { stderr: string; status: number };
      expect(e.stderr).toContain('Error:');
      expect(e.stderr).toContain('ENOENT');
      expect(e.status).toBe(1);
    }
  });

  it('should handle parser errors with file context', () => {
    const content = '### Test\n<input>hello</input>'; // Missing output
    writeFileSync(tempFile, content);

    try {
      execSync(`${cli} ${tempFile}`, { encoding: 'utf-8', stdio: 'pipe' });
      expect.fail('Should have thrown an error');
    } catch (error) {
      const e = error as { stderr: string; status: number };
      expect(e.stderr).toContain('Error in');
      expect(e.stderr).toContain('has input but no output or error');
      expect(e.status).toBe(1);
    }
  });
});
