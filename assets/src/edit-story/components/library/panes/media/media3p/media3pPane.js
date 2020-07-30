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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useEffect } from 'react';
import { useFeature } from 'flagged';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import useMedia from '../../../../../app/media/useMedia';
import {
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import { SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import { ProviderType } from '../common/providerType';
import Flags from '../../../../../flags';
import Media3pCategories from './media3pCategories';
import paneId from './paneId';
import ProviderTab from './providerTab';

const ProviderTabSection = styled.div`
  margin-top: 30px;
  padding: 0 24px;
`;

const MediaDisplayName = styled.div`
  margin-top: 24px;
  padding: 0 24px;
  visibility: ${(props) => (props.shouldDisplay ? 'visible' : 'hidden')};
`;

/**
 * Pane that contains the media 3P integrations.
 *
 * @param {Object} props Component props
 * @return {*} The media pane element for 3P integrations.
 */
function Media3pPane(props) {
  const { isActive } = props;

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource) => insertElement(resource.type, { resource }),
    [insertElement]
  );

  const {
    searchTerm,
    setSelectedProvider,
    setSearchTerm,
    unsplash,
    selectedProviderState,
  } = useMedia(
    ({
      media3p: {
        state: { selectedProvider, searchTerm },
        actions: { setSelectedProvider, setSearchTerm },
        unsplash,
      },
      media3p,
    }) => ({
      searchTerm,
      setSelectedProvider,
      setSearchTerm,
      unsplash,
      selectedProviderState: media3p[selectedProvider ?? ProviderType.UNSPLASH],
    })
  );

  const {
    state: { categories },
    actions: { selectCategory, deselectCategory },
  } = selectedProviderState;

  useEffect(() => {
    if (isActive) {
      setSelectedProvider({ provider: 'unsplash' });
    }
  }, [isActive, setSelectedProvider]);

  const onSearch = (v) => setSearchTerm({ searchTerm: v });

  const incrementalSearchDebounceMedia = useFeature(
    Flags.INCREMENTAL_SEARCH_DEBOUNCE_MEDIA
  );

  const onProviderTabClick = useCallback(() => {
    // TODO(#2393): set state.
  }, []);

  const displayName = categories.selectedCategoryId
    ? categories.categories.find((e) => e.id === categories.selectedCategoryId)
        .displayName
    : __('Trending', 'web-stories');

  // We display the media name if there's media to display or a category has
  // been selected.
  // TODO: Update for Coverr.
  const displayMediaName = Boolean(
    (unsplash.state.isMediaLoaded && unsplash.state.media) ||
      categories.selectedCategoryId
  );

  // TODO(#2368): handle pagination / infinite scrolling
  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PaneHeader>
          <SearchInputContainer>
            <SearchInput
              initialValue={searchTerm}
              placeholder={__('Search', 'web-stories')}
              onSearch={onSearch}
              incremental={incrementalSearchDebounceMedia}
              disabled={Boolean(categories.selectedCategoryId)}
            />
          </SearchInputContainer>
          <ProviderTabSection>
            <ProviderTab
              name={'Unsplash'}
              active={true}
              onClick={onProviderTabClick}
            />
          </ProviderTabSection>
          <Media3pCategories
            categories={categories.categories}
            selectedCategoryId={categories.selectedCategoryId}
            selectCategory={selectCategory}
            deselectCategory={deselectCategory}
          />
          <MediaDisplayName shouldDisplay={displayMediaName}>
            {displayName}
          </MediaDisplayName>
        </PaneHeader>
        <PaginatedMediaGallery
          providerType={ProviderType.UNSPLASH}
          resources={unsplash.state.media}
          isMediaLoading={unsplash.state.isMediaLoading}
          isMediaLoaded={unsplash.state.isMediaLoaded}
          hasMore={unsplash.state.hasMore}
          setNextPage={unsplash.actions.setNextPage}
          onInsert={insertMediaElement}
        />
      </PaneInner>
    </StyledPane>
  );
}

Media3pPane.propTypes = {
  isActive: PropTypes.bool,
};

export default Media3pPane;
