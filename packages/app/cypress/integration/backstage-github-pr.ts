/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="cypress" />
// eslint-disable-next-line no-restricted-imports
import 'os';

describe('Github Pull Requests', () => {
    beforeEach(() => {
        cy.saveGithubToken();
        cy.intercept('GET', 'https://api.github.com/repos/organisation/github-project-slug/pulls?state=open&per_page=5&page=1', { fixture: 'githubPRs/pull-requests.json' })
        cy.visit('/catalog/default/component/sample-service')
    })

    describe('Navigating to GitHub Pull Requests', () => {
        it('should show GitHub Pull Requests in Overview tab', () => {
            cy.contains('Pull requests statistics');
        });

        it('should show GitHub Pull Requests when navigating to Pull Requests tab', () => {
            cy.visit('/catalog/default/component/sample-service/pull-requests')
            cy.contains('Pull requests plugin');
          });
    });
});