import { checkNotNull, LauncherClient } from 'launcher-client';
import React from 'react';
import { useLauncherClient } from '../contexts/launcher-client-context';
import { DataLoader } from '../core/data-loader/data-loader';

export function runtimeMatcherByCategory(category: string) {
  return (r) => r.metadata.categories.indexOf(category) >= 0;
}

export interface Runtime {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  metadata?: any;
  versions: Array<{ id: string; name: string; }>
}

async function loadRuntimes(client: LauncherClient, runtimeFilter?: string, versionFilter?: string): Promise<Runtime[]> {
  const enums = await client.enums(runtimeFilter, versionFilter);
  const runtimes = checkNotNull(enums['runtime.name'], `enums['runtime.name']`);
  return runtimes.map(r => {
    const versions = checkNotNull(enums[`runtime.version.${r.id}`], `enums['runtime.version.${r.id}']`);
    return {
      ...r,
      versions,
    }
  });
}

export function NewAppRuntimeLoader(props: { id: string, children: (runtime?: Runtime) => any }) {
  const client = useLauncherClient();
  const loader = async () => {
    const runtimes = await loadRuntimes(client);
    return runtimes.find(r => r.id === props.id);
  };
  return (
    <DataLoader loader={loader}>
      {props.children}
    </DataLoader>
  );
}

interface NewAppRuntimesLoaderProps {
  category: string;
  runtimeFilter?: string;
  versionFilter?: string;
  children: (items: Runtime[]) => any;
}

export function NewAppRuntimesLoader(props: NewAppRuntimesLoaderProps) {
  const client = useLauncherClient();
  const loader = async () => {
    const runtimes = await loadRuntimes(client);
    return runtimes.filter(runtimeMatcherByCategory(props.category));
  };
  return (
    <DataLoader loader={loader}>
      {props.children}
    </DataLoader>
  );
}
