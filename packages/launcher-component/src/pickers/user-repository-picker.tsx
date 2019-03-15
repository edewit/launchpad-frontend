import React from 'react';
import { Form, FormGroup, FormSelect, FormSelectOption, Grid, GridItem, TextInput } from '@patternfly/react-core';
import { GitInfo } from 'launcher-client';

import { InputProps, Picker } from '../core/types';
import style from './repository-picker.module.scss';

const REPOSITORY_VALUE_REGEXP = new RegExp('^[a-z][a-z0-9-.]{3,63}$');

export interface UserRepositoryPickerValue {
  org?: string;
  name?: string;
}

interface UserRepositoryPickerProps extends InputProps<UserRepositoryPickerValue> {
  gitInfo: GitInfo;
}

export function valueToPath(value: UserRepositoryPickerValue, login?: string) {
  if (value.org) {
    return `${value.org}/${value.name}`;
  }
  if (login) {
    return `${login}/${value.name}`;
  }
  return value.name || '';
}

const isExistingRepository = (repositories: string[], props: UserRepositoryPickerProps): boolean => {
  return repositories.indexOf(valueToPath(props.value, props.gitInfo.login)) !== -1;
};

export const UserRepositoryPicker: Picker<UserRepositoryPickerProps, UserRepositoryPickerValue> = {
  checkCompletion: value => (!value.org || REPOSITORY_VALUE_REGEXP.test(value.org)) && REPOSITORY_VALUE_REGEXP.test(value.name || ''),
  Element: props => {
    const name = props.value.name || '';
    const helperRepoInvalid = isExistingRepository(props.gitInfo.repositories, props) ?
      `Repository already exists ${valueToPath(props.value, props.gitInfo.login)}` : 'Invalid repository name';
    const isRepoValid = UserRepositoryPicker.checkCompletion(props.value)
      && !isExistingRepository(props.gitInfo.repositories, props);
    return (
      <Grid>
        <GridItem span={4} className={style.avatar}>
          <img src={props.gitInfo.avatarUrl} />
          <p><b>{props.gitInfo.login}</b></p>
        </GridItem>
        <GridItem span={8}>
          <h3>Choose a Repository</h3>
          <Form>
            <FormGroup
              label="Location"
              isRequired
              fieldId="ghOrg"
            >
              <FormSelect
                id="ghOrg"
                value={props.value.org}
                onChange={value => value ? props.onChange({ ...props.value, org: value }) : props.onChange({ name: props.value.name })}
                aria-label="Select organization"
              >
                <FormSelectOption
                  value={undefined}
                  label={props.gitInfo.login}
                />
                {props.gitInfo.organizations.map((o, index) => (
                  <FormSelectOption
                    key={index}
                    value={o}
                    label={o}
                  />)
                )}
              </FormSelect>
            </FormGroup>
            <FormGroup
              label="Repository"
              isRequired
              fieldId="ghRepo"
              helperTextInvalid={helperRepoInvalid}
              isValid={isRepoValid}
            >
              <TextInput
                isRequired
                type="text"
                id="ghRepo"
                name="ghRepo-name"
                placeholder="Select Repository"
                aria-describedby="Select Repository"
                onChange={value => props.onChange({ ...props.value, name: value })}
                value={name}
                pattern={REPOSITORY_VALUE_REGEXP.source}
                title="Valid repository name"
              />
            </FormGroup>
          </Form>
        </GridItem>
      </Grid>
    );
  }
};
