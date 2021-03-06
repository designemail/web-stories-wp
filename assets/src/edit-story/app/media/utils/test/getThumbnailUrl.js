/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import getThumbnailUrl from '../getThumbnailUrl';

describe('getThumbnailUrl', () => {
  beforeEach(() => {
    window.devicePixelRatio = 1;
  });

  it('should return the smallest available image URL greater than minWidth', () => {
    const resource = {
      src: 'default-url',
      sizes: {
        img1: { width: 200, height: 1, source_url: 'full-url' },
        img2: { width: 300, height: 1, source_url: 'med-url' },
        img3: { width: 400, height: 1, source_url: 'large-url' },
      },
    };
    expect(getThumbnailUrl(210, resource)).toBe('med-url');
  });

  it('should return an image according to the device pixel ratio', () => {
    window.devicePixelRatio = 2;
    const resource = {
      src: 'default-url',
      sizes: {
        img1: { width: 200, height: 1, source_url: 'full-url' },
        img2: { width: 300, height: 1, source_url: 'med-url' },
        img3: { width: 400, height: 1, source_url: 'large-url' },
      },
    };
    expect(getThumbnailUrl(160, resource)).toBe('large-url');
  });

  it('should never return the one with key=thumbnail', () => {
    const resource = {
      src: 'default-url',
      sizes: {
        thumbnail: { width: 200, height: 1, source_url: 'thumb-url' },
        img1: { width: 300, height: 1, source_url: 'large-url' },
        img2: { width: 400, height: 1, source_url: 'full-url' },
      },
    };
    expect(getThumbnailUrl(180, resource)).toBe('large-url');
  });

  it('should return the resource.src if there is no valid thumb', () => {
    const resource = {
      src: 'default-url',
      sizes: {
        img1: { width: 200, height: 1, source_url: 'small-url' },
        img2: { width: 300, height: 1, source_url: 'med-url' },
        img3: { width: 400, height: 1, source_url: 'large-url' },
      },
    };
    expect(getThumbnailUrl(440, resource)).toBe('default-url');
  });

  it('should return the default src URL if no alternatives', () => {
    const resource = { src: 'default-url' };
    expect(getThumbnailUrl(200, resource)).toBe('default-url');
  });
});
