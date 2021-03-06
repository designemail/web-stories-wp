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
 * External dependencies
 */
import { memo } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import useCanvas from './useCanvas';
import DisplayElement from './displayElement';
import { Layer, PageArea } from './layout';

function DisplayLayer() {
  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));
  const {
    editingElement,
    setPageContainer,
    setFullbleedContainer,
  } = useCanvas(
    ({
      state: { editingElement },
      actions: { setPageContainer, setFullbleedContainer },
    }) => ({ editingElement, setPageContainer, setFullbleedContainer })
  );

  return (
    <Layer
      data-testid="DisplayLayer"
      pointerEvents="none"
      aria-label={__('Display', 'web-stories')}
    >
      <PageArea
        ref={setPageContainer}
        fullbleedRef={setFullbleedContainer}
        background={currentPage?.backgroundColor}
      >
        {currentPage
          ? currentPage.elements.map(({ id, ...rest }) => {
              if (editingElement === id) {
                return null;
              }
              return (
                <DisplayElement
                  key={id}
                  element={{ id, ...rest }}
                  page={currentPage}
                />
              );
            })
          : null}
      </PageArea>
    </Layer>
  );
}

export default memo(DisplayLayer);
