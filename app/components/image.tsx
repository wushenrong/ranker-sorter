/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

type ImageProps = {
  src: string;
  alt: string;
};

export function Image({ src, alt }: ImageProps) {
  return <img alt={alt} height={64} src={src} width={64} />;
}
