import Fuse from 'fuse.js';

import { UIDataColumn } from './useUIDataColumns';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { CellData, OrgColumn } from '../utils/types';

type OrgMap = { orgId: number; value: CellData };

const useGuessOrganisaion = (
  orgId: number,
  uiDataColumn: UIDataColumn<OrgColumn>
) => {
  const subOrgs = useSubOrganizations(orgId);

  const fuse = new Fuse(subOrgs.data || [], {
    includeScore: true,
    keys: ['title'],
  });

  const guessOrg = () => {
    // Loop through each possible cell value
    const matchedRows = uiDataColumn.uniqueValues.reduce(
      (acc: OrgMap[], orgTitle: string | number) => {
        if (typeof orgTitle === 'string') {
          // Find orgs with most similar name
          const results = fuse.search(orgTitle);
          // Filter out items with a bad match
          const goodResults = results.filter(
            (result) => result.score && result.score < 0.25
          );
          // If there is a match, guess it
          if (goodResults.length > 0) {
            return [
              ...acc,
              {
                orgId: goodResults[0].item.id,
                value: orgTitle,
              },
            ];
          }
        }
        return acc;
      },
      []
    );

    uiDataColumn.selectOrgs(matchedRows);
  };

  return guessOrg;
};

export default useGuessOrganisaion;
