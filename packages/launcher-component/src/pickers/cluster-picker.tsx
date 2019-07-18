import React from 'react';
import {
  Button,
  DataList,
  DataListCell,
  DataListItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Radio,
  Title,
  DataListItemRow,
  DataListAction,
  FormGroup,
  TextInput,
  Form
} from '@patternfly/react-core';
import { OpenshiftIcon } from '@patternfly/react-icons';
import { OpenShiftCluster } from '@launcher/client';

import { InputProps, Picker } from '../core/types';
import { Loader } from '../core/stuff';

export interface ClusterPickerValue {
  clusterId?: string;
  clusterUrl?: string;
  clusterToken?: string;
  clusterType?: string;
}

interface ClusterPickerProps extends InputProps<ClusterPickerValue> {
  clusters: OpenShiftCluster[];
  authorizationLinkGenerator: (id?: string) => string;
}

export const ClusterPicker: Picker<ClusterPickerProps, ClusterPickerValue> = {
  checkCompletion: value => !!value.clusterId && !!value.clusterType,
  Element: props => {
    if (props.clusters.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon icon={OpenshiftIcon} />
          <Title size="lg">No Active Clusters Found</Title>
          <EmptyStateBody>
            We couldn't find an active cluster associated to your account.
          </EmptyStateBody>
          <Button
            // @ts-ignore
            component="a"
            href={props.authorizationLinkGenerator()}
            target="_blank"
          >
            activate a cluster
          </Button>
        </EmptyState>
      );
    }
    return (
      <React.Fragment>
        <DataList aria-label="select-cluster">
          {
            props.clusters.map((cluster, i) => {
              const isSelected = props.value.clusterId === cluster.id;
              const onChangeSelected = () => {
                if (cluster.connected) {
                  props.onChange({ clusterId: cluster.id, clusterType: cluster.type });
                }
              };

              if (!props.value.clusterId) {
                const connectedClusters = props.clusters.filter(c => c.connected);
                if (connectedClusters.length >= 1) {
                  props.onChange({ clusterId: connectedClusters[0].id, clusterType: connectedClusters[0].type });
                  return (<Loader key={i} />);
                }
              }
              return (
                <DataListItem
                  isExpanded={false}
                  aria-labelledby={cluster.name}
                  value={cluster.id}
                  key={i}
                  style={cluster.connected ? { cursor: 'pointer' } : { cursor: 'not-allowed' }}
                >
                  <DataListItemRow>
                    <DataListCell width={1} style={{ flex: 'none' }}>
                      <Radio
                        aria-label={`Choose ${cluster.id} as cluster`}
                        value={cluster.id}
                        isChecked={isSelected}
                        onChange={onChangeSelected}
                        name="cluster"
                        isDisabled={!cluster.connected}
                        id={`radio-choose-${cluster.id}-as-cluster`}
                      />
                    </DataListCell>
                    <DataListCell
                      width={1}
                      onClick={onChangeSelected}
                      style={{ flex: 'none' }}
                    >
                      <OpenshiftIcon />
                    </DataListCell>
                    <DataListCell width={3} onClick={onChangeSelected}>
                      <Title size="md" style={!cluster.connected ? { color: '#ccc' } : {}}>{cluster.name}</Title>
                    </DataListCell>
                    {!cluster.connected && (
                      <DataListAction aria-label="Authorize cluster action" aria-labelledby="authorize-link-action" id="authorize-link-action" width={1}>
                        <Button
                          // @ts-ignore
                          component="a"
                          href={props.authorizationLinkGenerator(cluster.id)}
                          target="_blank"
                        >
                          Authorize
                      </Button>
                      </DataListAction>
                    )}
                  </DataListItemRow>
                </DataListItem>
              );
            })
          }
        </DataList>
        <hr />
        <Form>
          <FormGroup
            label="Cluster API Url"
            fieldId="cluster-url-picker"
            helperTextInvalid="Please provide a valid url that uses http"
          >
            <TextInput
              isRequired
              type="text"
              id="cluster-url-picker"
              name="cluster-url-picker"
              aria-label="Cluster url"
              placeholder="Type the cluster api url"
              onChange={value => props.onChange({ ...props.value, clusterUrl: value })}
              value={props.value.clusterUrl || ''}
            />
          </FormGroup>
          <FormGroup
            label="Cluster Token"
            fieldId="cluster-token-picker"
          >
            <TextInput
              isRequired
              type="text"
              id="cluster-token-picker"
              name="cluster-token-picker"
              aria-label="Cluster token"
              placeholder="Type the api token"
              onChange={value => props.onChange({ ...props.value, clusterToken: value })}
              value={props.value.clusterToken || ''}
            />
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }
};
