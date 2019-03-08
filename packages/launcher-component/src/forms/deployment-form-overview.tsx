import { Button, EmptyState, EmptyStateBody, Title } from '@patternfly/react-core';
import * as React from 'react';
import { OpenshiftClusterLoader } from '../loaders/openshiftcluster-loader';
import { DeploymentFormValue } from './deployment-form';
import { OverviewComplete } from '../core/hub-n-spoke/overview-complete';
import { SpecialValue } from '../core/stuff';

interface DeploymentFormProps {
  value: DeploymentFormValue;
  onClick: () => void;
}

export function DeploymentFormOverview(props: DeploymentFormProps) {

  if (!props.value.cluster.clusterId) {
    return (
      <EmptyState>
        <Title size="lg">You need to configure the OpenShift deployment</Title>
        <EmptyStateBody>
          You are going to choose where your application will be built, deployed and served.
        </EmptyStateBody>
        <Button variant="primary" onClick={props.onClick}>Configure OpenShift Deployment</Button>
      </EmptyState>
    );
  }
  return (
    <OpenshiftClusterLoader clusterId={props.value.cluster.clusterId}>
      {result => (
        <OverviewComplete title="OpenShift Deployment is configured">
          You application will be deployed to the <SpecialValue>{result!.name}</SpecialValue> OpenShift cluster.
        </OverviewComplete>
      )}
    </OpenshiftClusterLoader>
  );
}
