import { useTheme } from '@mui/styles';
import { DoorFront, Place } from '@mui/icons-material';
import {
  AttributionControl,
  FeatureGroup,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { Box, Divider, lighten, Typography } from '@mui/material';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { FeatureGroup as FeatureGroupType } from 'leaflet';

import { assigneesFilterContext } from './OrganizerMapFilters/AssigneeFilterContext';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import isPointInsidePolygon from '../../canvass/utils/isPointInsidePolygon';
import { ZetkinArea } from 'features/areas/types';
import ZUIAvatar from 'zui/ZUIAvatar';
import {
  ZetkinAssignmentAreaStats,
  ZetkinAreaAssignment,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
} from '../types';
import { getBoundSize } from '../../canvass/utils/getBoundSize';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import { getVisitPercentage } from 'features/canvass/utils/getVisitPercentage';
import { ZetkinPerson } from '../../../utils/types/zetkin';

const LocationMarker: FC<{
  areaAssId: string;
  idOfMetricThatDefinesDone: string;
  location: ZetkinLocation;
  locationStyle: 'dot' | 'households' | 'progress';
}> = ({ areaAssId, idOfMetricThatDefinesDone, location, locationStyle }) => {
  const theme = useTheme();
  if (locationStyle == 'dot') {
    return (
      <DivIconMarker
        iconAnchor={[2, 2]}
        position={location.position}
        zIndexOffset={-1000}
      >
        <Box
          bgcolor={theme.palette.text.primary}
          borderRadius="2em"
          height={6}
          width={6}
        />
      </DivIconMarker>
    );
  } else if (locationStyle == 'households') {
    return (
      <DivIconMarker iconAnchor={[6, 22]} position={location.position}>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          minWidth="15px"
        >
          <Box
            alignItems="center"
            bgcolor="white"
            borderRadius={1}
            boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
            color={theme.palette.text.secondary}
            display="inline-flex"
            flexDirection="column"
            fontSize="14px"
            justifyContent="center"
            paddingX="10px"
            width="100%"
          >
            {location.households.length}
          </Box>
          <div
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid white',
              boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.3)',
              height: 0,
              width: 0,
            }}
          />
        </Box>
      </DivIconMarker>
    );
  } else {
    const percentage = getVisitPercentage(
      areaAssId,
      location.households,
      idOfMetricThatDefinesDone
    );

    return (
      <DivIconMarker iconAnchor={[6, 24]} position={location.position}>
        <MarkerIcon percentage={percentage} selected={false} />
      </DivIconMarker>
    );
  }
};

type OrganizerMapRendererProps = {
  areaAssId: string;
  areaStats: ZetkinAssignmentAreaStats;
  areaStyle: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  areas: ZetkinArea[];
  assignment: ZetkinAreaAssignment;
  locationStyle: 'dot' | 'households' | 'progress' | 'hide';
  locations: ZetkinLocation[];
  navigateToAreaId?: string;
  onSelectedIdChange: (newId: string) => void;
  overlayStyle: 'assignees' | 'households' | 'progress' | 'hide';
  selectedId: string;
  sessions: ZetkinAreaAssignmentSession[];
};

function HouseholdOverlayMarker(props: {
  numberOfHouseholds: number;
  numberOfLocations: number;
}) {
  const theme = useTheme();
  return (
    <Box
      alignItems="center"
      bgcolor="white"
      borderRadius={1}
      boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
      display="inline-flex"
      flexDirection="column"
      gap="2px"
      padding="2px 6px"
      sx={{ translate: '-50% -50%' }}
    >
      <Typography alignItems="center" display="flex" fontSize="14px">
        <DoorFront fontSize="small" sx={{ color: theme.palette.grey[300] }} />
        {props.numberOfHouseholds}
      </Typography>
      <Divider
        sx={{
          width: '100%',
        }}
      />
      <Typography alignItems="center" display="flex" fontSize="14px">
        <Place fontSize="small" sx={{ color: theme.palette.grey[300] }} />

        {props.numberOfLocations}
      </Typography>
    </Box>
  );
}

function ProgressOverlayMarker(props: {
  successfulVisitsColorPercent: number;
  visitsColorPercent: number;
}) {
  const theme = useTheme();

  return (
    <Box
      bgcolor="white"
      borderRadius={1}
      boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
      display="inline-flex"
      flexDirection="column"
      padding={0.5}
      sx={{ translate: '-50% -50%' }}
    >
      <div
        style={{
          alignItems: 'center',
          background: `conic-gradient(${theme.palette.primary.main} ${
            props.successfulVisitsColorPercent
          }%, ${lighten(theme.palette.primary.main, 0.7)} ${
            props.successfulVisitsColorPercent
          }% ${props.visitsColorPercent}%, ${theme.palette.grey[400]} ${
            props.visitsColorPercent
          }%)`,
          borderRadius: '2em',
          display: 'flex',
          flexDirection: 'row',
          height: '30px',
          justifyContent: 'center',
          width: '30px',
        }}
      />
    </Box>
  );
}

function NumberOverlayMarker(props: { value: number }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        borderRadius: 10,
        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        color: theme.palette.primary.contrastText,
        display: 'flex',
        fontWeight: 'bold',
        height: 30,
        justifyContent: 'center',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        width: 30,
      }}
    >
      <Box>{props.value}</Box>
    </Box>
  );
}

function AssigneeOverlayMarker({
  organizationID,
  people,
  zoom,
}: {
  organizationID: number;
  people: ZetkinPerson[];
  zoom: number;
}) {
  return (
    <Box
      alignItems="center"
      display="inline-flex"
      flexWrap="wrap"
      gap="2px"
      justifyContent="center"
      sx={{
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
      }}
      width={zoom >= 16 ? '95px' : '65px'}
    >
      {people.map((person, index) => {
        if (index <= 4) {
          return (
            <Box
              //TODO: only use person id once we have logic preventing
              //assigning the same person to an area more than once
              key={`${person.id}-${index}`}
              sx={{
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(0,0,0,0.3)',
              }}
            >
              <ZUIAvatar
                size={zoom >= 16 ? 'sm' : 'xs'}
                url={`/api/orgs/${organizationID}/people/${person.id}/avatar`}
              />
            </Box>
          );
        } else if (index == 5) {
          return (
            <Box
              alignItems="center"
              bgcolor="white"
              borderRadius="100%"
              display="flex"
              height={zoom >= 16 ? '30px' : '20px'}
              justifyContent="center"
              padding={1}
              sx={{ boxShadow: '0 0 8px rgba(0,0,0,0.3)' }}
              width={zoom >= 16 ? '30px' : '20px'}
            >
              <Typography
                color="secondary"
                fontSize={zoom >= 16 ? 14 : 11}
              >{`+${people.length - 5}`}</Typography>
            </Box>
          );
        } else {
          return null;
        }
      })}
    </Box>
  );
}

const OrganizerMapRenderer: FC<OrganizerMapRendererProps> = ({
  areas,
  areaStats,
  areaStyle,
  assignment,
  areaAssId,
  locations,
  selectedId,
  sessions,
  navigateToAreaId,
  onSelectedIdChange,
  overlayStyle,
  locationStyle,
}) => {
  const theme = useTheme();
  const reactFGref = useRef<FeatureGroupType | null>(null);

  const [zoomed, setZoomed] = useState(false);
  const [zoom, setZoom] = useState(0);

  const map = useMapEvents({
    zoom: () => {
      setZoom(map.getZoom());
      setZoomed(true);
    },
  });

  //Get the group element that groups all the area svg:s
  //and lower its collective opacity, to avoid misleading
  //data colors on stacked areas.
  const gElement = map.getPanes().overlayPane.querySelector('g');
  if (gElement) {
    gElement.style.opacity = '0.6';
  }

  useEffect(() => {
    if (map && !zoomed) {
      if (navigateToAreaId) {
        const areaToNavigate = areas.find(
          (area) => area.id === navigateToAreaId
        );
        if (areaToNavigate) {
          map.fitBounds(areaToNavigate.points);
          setZoomed(true);
        }
      } else {
        const bounds = reactFGref.current?.getBounds();
        if (bounds?.isValid()) {
          map.fitBounds(bounds);
          setZoomed(true);
        }
      }
    }
  }, [areas, map]);

  const { assigneesFilter } = useContext(assigneesFilterContext);

  const getAreaColor = (
    hasPeople: boolean,
    householdColorPercent: number,
    visitsColorPercent: number
  ) => {
    if (areaStyle == 'hide' || areaStyle == 'outlined') {
      return 'transparent';
    }

    if (areaStyle == 'assignees') {
      return hasPeople
        ? theme.palette.primary.main
        : theme.palette.secondary.main;
    }

    if (areaStyle == 'progress' && !hasPeople) {
      return theme.palette.secondary.main;
    }

    return areaStyle == 'households'
      ? //TODO: Use theme colors for these
        `color-mix(in hsl, ${lighten(theme.palette.primary.main, 0.8)}, ${
          theme.palette.primary.main
        } ${householdColorPercent}%)`
      : `color-mix(in hsl,  ${lighten(theme.palette.primary.main, 0.8)}, ${
          theme.palette.primary.main
        } ${visitsColorPercent || 1}%)`;
  };

  const locationsByAreaId: Record<string, ZetkinLocation[]> = {};
  areas.forEach((area) => {
    locationsByAreaId[area.id] = [];

    locations.forEach((location) => {
      const isInsideArea = isPointInsidePolygon(
        location.position,
        area.points.map((point) => ({
          lat: point[0],
          lng: point[1],
        }))
      );
      if (isInsideArea) {
        locationsByAreaId[area.id].push(location);
      }
    });
  });

  let highestHousholds = 0;
  Object.keys(locationsByAreaId).forEach((id) => {
    let numberOfHouseholdsInArea = 0;
    locationsByAreaId[id].forEach((location) => {
      numberOfHouseholdsInArea += location.households.length;
    });

    if (numberOfHouseholdsInArea > highestHousholds) {
      highestHousholds = numberOfHouseholdsInArea;
    }
  });

  const filteredAreas = areas
    .map((area) => {
      const people = sessions
        .filter((session) => session.area.id == area.id)
        .map((session) => session.assignee);
      const hasPeople = !!people.length;
      return { ...area, hasPeople };
    })
    .filter((area) => {
      // Right now there is only one kind of filter
      if (assigneesFilter === null) {
        return true;
      }

      if (area.hasPeople && assigneesFilter == 'unassigned') {
        return false;
      } else if (!area.hasPeople && assigneesFilter == 'assigned') {
        return false;
      }
      return true;
    });

  return (
    <>
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup
        ref={(fgRef) => {
          reactFGref.current = fgRef;
        }}
      >
        {filteredAreas
          .sort((a0, a1) => {
            // Always render selected last, so that it gets
            // rendered on top of the unselected ones in case
            // there are overlaps.
            if (a0.id == selectedId) {
              return 1;
            } else if (a1.id == selectedId) {
              return -1;
            } else {
              // When  none of the two areas are selected, sort them
              // by size, so that big ones are underneath and the
              // smaller ones can be clicked.
              return getBoundSize(a1) - getBoundSize(a0);
            }
          })
          .map((area) => {
            const selected = selectedId == area.id;

            // The key changes when selected, to force redraw of polygon
            // to reflect new state through visual style
            const key =
              area.id +
              (selected ? '-selected' : '-default') +
              `-${areaStyle}` +
              (area.hasPeople ? '-assigned' : '');

            const stats = areaStats.stats.find(
              (stat) => stat.areaId == area.id
            );

            let numberOfHouseholds = 0;
            locationsByAreaId[area.id].forEach(
              (location) => (numberOfHouseholds += location.households.length)
            );
            const householdColorPercent =
              (numberOfHouseholds / highestHousholds) * 100;

            const visitsColorPercent = stats?.num_households
              ? (stats.num_visited_households / stats.num_households) * 100
              : 0;

            return (
              <Polygon
                key={key}
                color={areaStyle == 'hide' ? '' : 'black'}
                dashArray={!area.hasPeople ? '5px 7px' : ''}
                eventHandlers={{
                  click: () => {
                    onSelectedIdChange(selected ? '' : area.id);
                  },
                }}
                fillColor={getAreaColor(
                  area.hasPeople,
                  householdColorPercent,
                  visitsColorPercent
                )}
                fillOpacity={1}
                interactive={areaStyle != 'hide'}
                positions={area.points}
                weight={selected ? 5 : 2}
              />
            );
          })}
      </FeatureGroup>
      {locationStyle != 'hide' && (
        <FeatureGroup>
          {locations.map((location) => {
            //Find ids of area/s that the location is in
            const areaIds: string[] = [];
            areas.forEach((area) => {
              const isInsideArea = isPointInsidePolygon(
                location.position,
                area.points.map((point) => ({
                  lat: point[0],
                  lng: point[1],
                }))
              );

              if (isInsideArea) {
                areaIds.push(area.id);
              }
            });

            //See if any of those areas have assignees in this assignment
            let idOfAreaInThisAssignment = '';
            for (let i = 0; i < areaIds.length; i++) {
              const id = areaIds[i];
              const people = sessions
                .filter((session) => session.area.id == id)
                .map((session) => session.assignee);

              const hasPeople = !!people.length;

              if (hasPeople) {
                idOfAreaInThisAssignment = id;
                break;
              }
            }

            //Check if the location has housholds with visits in this assignment
            const hasVisitsInThisAssignment = location.households.some(
              (household) =>
                !!household.visits.find((visit) => visit.areaAssId == areaAssId)
            );

            //If user wants to see progress of locations,
            //don't show locations outside of assigned areas
            //unless they have visits in this assignment
            const hideFromProgressView =
              locationStyle == 'progress' &&
              !idOfAreaInThisAssignment &&
              !hasVisitsInThisAssignment;

            if (hideFromProgressView) {
              return null;
            }

            return (
              <LocationMarker
                key={location.id}
                areaAssId={areaAssId}
                idOfMetricThatDefinesDone={
                  assignment.metrics.find((metric) => metric.definesDone)?.id ||
                  ''
                }
                location={location}
                locationStyle={locationStyle}
              />
            );
          })}
        </FeatureGroup>
      )}
      <FeatureGroup>
        {filteredAreas.map((area) => {
          const mid: [number, number] = [0, 0];
          if (area.points.length) {
            area.points
              .map((input) => {
                if ('lat' in input && 'lng' in input) {
                  return [input.lat as number, input.lng as number];
                } else {
                  return input;
                }
              })
              .forEach((point) => {
                mid[0] += point[0];
                mid[1] += point[1];
              });

            mid[0] /= area.points.length;
            mid[1] /= area.points.length;
          }

          const detailed = zoom >= 15;

          const people = sessions
            .filter((session) => session.area.id == area.id)
            .map((session) => session.assignee);

          const stats = areaStats.stats.find((stat) => stat.areaId == area.id);

          let numberOfHouseholds = 0;
          locationsByAreaId[area.id].forEach(
            (location) => (numberOfHouseholds += location.households.length)
          );
          const numberOfLocations = locationsByAreaId[area.id].length;

          const visitsColorPercent = stats?.num_households
            ? (stats.num_visited_households / stats.num_households) * 100
            : 0;

          const successfulVisitsColorPercent = stats?.num_households
            ? (stats.num_successful_visited_households / stats.num_households) *
              100
            : 0;

          const markerToRender = () => {
            if (overlayStyle === 'households') {
              return (
                <HouseholdOverlayMarker
                  numberOfHouseholds={numberOfHouseholds}
                  numberOfLocations={numberOfLocations}
                />
              );
            }
            if (overlayStyle == 'progress') {
              return (
                <ProgressOverlayMarker
                  successfulVisitsColorPercent={successfulVisitsColorPercent}
                  visitsColorPercent={visitsColorPercent}
                />
              );
            }
            if (overlayStyle === 'assignees' && area.hasPeople) {
              if (detailed) {
                return (
                  <AssigneeOverlayMarker
                    organizationID={assignment.organization.id}
                    people={people}
                    zoom={zoom}
                  />
                );
              }
              return <NumberOverlayMarker value={people.length} />;
            }
            return null;
          };

          const marker = markerToRender();
          if (marker === null) {
            return null;
          }
          return (
            <DivIconMarker
              key={area.id}
              iconAnchor={[0, 0]}
              position={mid}
              zIndexOffset={100}
            >
              {marker}
            </DivIconMarker>
          );
        })}
      </FeatureGroup>
    </>
  );
};

export default OrganizerMapRenderer;
