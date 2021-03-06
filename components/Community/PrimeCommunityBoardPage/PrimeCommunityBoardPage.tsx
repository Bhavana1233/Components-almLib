/**
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
// import { Link } from "react-router-dom";
// const PrimeCommunityBoardPage = () =>{
//   return(
//     <div>
//        <div>PrimeCommunityBoardPage</div>
//        <Link to ='/primeCatalogContainer'>Go to CAtalog Page</Link>

//     </div>
   
    
//   );
// }



import { PrimeCommunityBoard } from "../PrimeCommunityBoard";
import { useBoard } from "../../../hooks/community";
import { usePosts } from "../../../hooks/community";
import styles from "./PrimeCommunityBoardPage.module.css";
import { PrimeCommunityAddPost } from "../PrimeCommunityAddPost";
import { PrimeCommunityPosts } from "../PrimeCommunityPosts";
import { PrimeCommunitySearch } from "../PrimeCommunitySearch";
import { PrimeCommunityMobileBackBanner } from "../PrimeCommunityMobileBackBanner";
import { PrimeCommunityMobileScrollToTop } from "../PrimeCommunityMobileScrollToTop";
// import { PrimeCommunitySearch } from "../PrimeCommunitySearch";

import { useState } from "react";
import { useIntl } from "react-intl";
import { getALMConfig, getPathParams } from "../../../utils/global";
import { ALMLoader } from "../../Common/ALMLoader";
import { ALMErrorBoundary } from "../../Common/ALMErrorBoundary";
const BOARD_ID_STR = "boardId";

const PrimeCommunityBoardPage = () => {
  const [boardId] = useState(() => {
    let { communityBoardDetailsPath } = getALMConfig();
    let pathParams = getPathParams(communityBoardDetailsPath, [BOARD_ID_STR]);
    return pathParams[BOARD_ID_STR];
  });
  const { item } = useBoard(boardId);
  const { formatMessage } = useIntl();
  const { fetchPosts } = usePosts();
  const [showLoader, setShowLoader] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState(0);

  const showLoaderHandler = (value: any) => {
    setShowLoader(value);
  };

  const searchCountHandler = (value: any) => {
    setSearchResult(
      value
        ? value.length
        : formatMessage({
            id: "alm.community.search.no.label",
            defaultMessage: "No",
          })
    );
  };

  const searchModeHandler = (value: any) => {
    setIsSearchMode(value);
  };

  const resetSearchHandler = async () => {
    setIsSearchMode(false);
    setSearchResult(0);
    setShowLoader(true);
    await fetchPosts(boardId);
    setShowLoader(false);
  };

  return (
    <ALMErrorBoundary>
      {/* Below 2 are seen only in mobile view */}
      <PrimeCommunityMobileBackBanner></PrimeCommunityMobileBackBanner>
      <PrimeCommunityMobileScrollToTop></PrimeCommunityMobileScrollToTop>

      <div className={styles.primeCommunitySearchContainer}>
        <div className={styles.primeCommunitySearchWrapper}>
          {item && (
            <PrimeCommunitySearch
              objectId={item.id}
              type="board"
              searchCountHandler={(value: any) => searchCountHandler(value)}
              showLoaderHandler={showLoaderHandler}
              searchModeHandler={searchModeHandler}
              resetSearchHandler={resetSearchHandler}
              placeHolderText={formatMessage({
                id: "alm.community.searchInBoard.placeholder",
                defaultMessage: "Search within board",
              })}
            ></PrimeCommunitySearch>
          )}
        </div>
      </div>
      <div className={styles.primeBoardParent}>
        {item && <PrimeCommunityBoard board={item}></PrimeCommunityBoard>}
      </div>
      {item && (
        <PrimeCommunityAddPost boardId={item.id}></PrimeCommunityAddPost>
      )}
      {showLoader && (
        <div className={styles.primeLoaderWrapper}>
          <ALMLoader />
        </div>
      )}
      {isSearchMode && !showLoader && (
        <div className={styles.primeCommunitySearchStatus}>
          <div className={styles.primeCommunitySearchCount}>
            {searchResult}{" "}
            {formatMessage({
              id: "alm.community.search.resultFound",
              defaultMessage: "result(s) found",
            })}
          </div>
          <button
            className={styles.primeCommunitySearchClear}
            onClick={resetSearchHandler}
          >
            (
            {formatMessage({
              id: "alm.community.search.clear.label",
              defaultMessage: "Clear",
            })}
            )
          </button>
        </div>
      )}
      {item && (
        <PrimeCommunityPosts
          boardId={item.id}
          showLoader={(value: boolean) => setShowLoader(value)}
          isSearchMode={isSearchMode}
        ></PrimeCommunityPosts>
      )}
    </ALMErrorBoundary>
  );
      };

export default PrimeCommunityBoardPage;
