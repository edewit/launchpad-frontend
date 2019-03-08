import { BackendFormValue } from './backend-form';
import { Button, EmptyState, EmptyStateBody, List, ListItem, Title } from '@patternfly/react-core';
import * as React from 'react';
import { RuntimeLoader } from '../loaders/enums-runtimes-loaders';
import { CapabilitiesByModuleLoader } from '../loaders/capabilities-loader';
import { OverviewComplete } from '../core/hub-n-spoke/overview-complete';
import { SpecialValue } from '../core/stuff';

interface BackendOverviewProps {
  value: BackendFormValue;
  onClick: () => void;
}

export function BackendFormOverview(props: BackendOverviewProps) {

  if (!props.value.runtime) {
    return (
      <EmptyState>
        <Title size="lg">You can select a Backend for your custom application</Title>
        <EmptyStateBody>
          By selecting a bunch of capabilities (Http Api, Database, ...), you will be able to bootstrap the backend of
          your application in a few seconds...
        </EmptyStateBody>
        <Button variant="primary" onClick={props.onClick}>Select Backend</Button>
      </EmptyState>
    );
  }
  return (
    <RuntimeLoader id={props.value.runtime.id}>
      {runtime => (
        <OverviewComplete title={`Your ${runtime!.name} backend is configured`}>
          <CapabilitiesByModuleLoader categories={['backend', 'support']}>
            {capabilitiesById => (
              <div style={{textAlign: 'left'}}>
                It will feature:
                <List variant="grid">
                  {props.value.capabilities.filter(c => c.selected)
                    .map(c => (<ListItem key={c.id}><SpecialValue>{capabilitiesById.get(c.id)!.name}</SpecialValue></ListItem>))}
                </List>
              </div>
            )}
          </CapabilitiesByModuleLoader>
        </OverviewComplete>
      )}
    </RuntimeLoader>
  );
}
