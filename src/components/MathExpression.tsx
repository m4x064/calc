"use client";

import katex from "katex";
import { useMemo } from "react";

type MathExpressionProps = {
  expression: string;
  block?: boolean;
  className?: string;
};

function normalizeExpression(expression: string) {
  const trimmed = expression.trim();
  const withRoots = trimmed
    .replace(/sqrt\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/C\((\d+),(\d+)\)/g, "\\binom{$1}{$2}");
  const bracketFraction = withRoots.match(/^\[(.+)\]\s*\/\s*\[(.+)\]$/);
  const denominatorOnlyBracketFraction = withRoots.match(/^(.+?)\s*\/\s*\[(.+)\]$/);
  const normalized = bracketFraction
    ? `\\frac{${bracketFraction[1]}}{${bracketFraction[2]}}`
    : denominatorOnlyBracketFraction
      ? `\\frac{${denominatorOnlyBracketFraction[1]}}{${denominatorOnlyBracketFraction[2]}}`
      : withRoots;

  return normalized
    .replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}")
    .replace(/\b([0-9a-zA-Z]+)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}")
    .replace(/\b([0-9a-zA-Z]+)\s*\/\s*([0-9a-zA-Z]+)/g, "\\frac{$1}{$2}")
    .replace(/\balpha\b/g, "\\alpha")
    .replace(/\bbeta\b/g, "\\beta")
    .replace(/\btheta\b/g, "\\theta")
    .replace(/\bpi\b/g, "\\pi")
    .replace(/\bsin\b/g, "\\sin")
    .replace(/\bcos\b/g, "\\cos")
    .replace(/\bmod\b/g, "\\bmod")
    .replace(/\bor\b/g, "\\text{ or }")
    .replace(/\bmin\b/g, "\\min")
    .replace(/\bmax\b/g, "\\max")
    .replace(/sinθ/g, "\\sin\\theta")
    .replace(/cosθ/g, "\\cos\\theta")
    .replace(/θ/g, "\\theta")
    .replace(/π/g, "\\pi")
    .replace(/\*/g, "\\times ")
    .replace(/×/g, "\\times ")
    .replace(/>=/g, "\\ge ")
    .replace(/<=/g, "\\le ")
    .replace(/\.\.\./g, "\\cdots")
    .replace(/\bfind\b/g, "\\;")
    .replace(/(^|[^\\])\bsum(?=[\s_{(])/g, "$1\\sum")
    .replace(/(^|[^\\])\blog(?=_)/g, "$1\\log")
    .replace(/,/g, ",\\;")
    .replace(/\s+/g, " ");
}

function shouldRenderAsPlainText(expression: string) {
  return /\b(two dice|arrangements|sector|on BC|angle 60 degrees)\b/i.test(
    expression
  );
}

export function MathExpression({
  expression,
  block = false,
  className = ""
}: MathExpressionProps) {
  const html = useMemo(
    () =>
      katex.renderToString(normalizeExpression(expression), {
        displayMode: block,
        throwOnError: false,
        strict: false
      }),
    [block, expression]
  );

  if (shouldRenderAsPlainText(expression)) {
    const Component = block ? "div" : "span";

    return (
      <Component
        className={`${block ? "math-block" : "math-inline"} ${className}`}
      >
        <span className="block break-words text-base font-black not-italic leading-8 text-ink sm:text-lg">
          {expression}
        </span>
      </Component>
    );
  }

  const Component = block ? "div" : "span";

  return (
    <Component
      className={`${block ? "math-block" : "math-inline"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
