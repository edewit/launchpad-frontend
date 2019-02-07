import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {storiesOf} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {mockLauncherClient} from 'launcher-client';
import {FormPanel} from "../../../core/form-panel/form-panel";
import {LauncherClientContext} from "../../../launcher-client-context";
import {BackendPicker, defaultBackendValue} from "../backend-picker";


const client = mockLauncherClient({creatorUrl: 'efe', launcherURL: 'eqg'});

storiesOf('BackendPicker', module)
  .add('default', () => {
    return (
      <LauncherClientContext.Provider value={client}>
        <FormPanel value={defaultBackendValue} onSave={action('save')}
                   onCancel={action('cancel')}>
          {
            (inputProps) => (<BackendPicker {...inputProps}/>)
          }
        </FormPanel>
      </LauncherClientContext.Provider>
    );
  });
