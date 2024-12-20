/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { useExpandableFlyoutApi } from '@kbn/expandable-flyout';
import { TestProviders } from '../../../common/mock';
import { DocumentDetailsRightPanelKey } from '../shared/constants/panel_keys';
import { mockFlyoutApi } from '../shared/mocks/mock_flyout_context';
import { mockContextValue } from '../shared/mocks/mock_context';
import { DocumentDetailsContext } from '../shared/context';
import { PreviewPanelFooter } from './footer';
import { PREVIEW_FOOTER_TEST_ID, PREVIEW_FOOTER_LINK_TEST_ID } from './test_ids';
import { createTelemetryServiceMock } from '../../../common/lib/telemetry/telemetry_service.mock';

jest.mock('@kbn/expandable-flyout');

const mockedTelemetry = createTelemetryServiceMock();
jest.mock('../../../common/lib/kibana', () => {
  return {
    useKibana: () => ({
      services: {
        telemetry: mockedTelemetry,
      },
    }),
  };
});

describe('<PreviewPanelFooter />', () => {
  beforeAll(() => {
    jest.mocked(useExpandableFlyoutApi).mockReturnValue(mockFlyoutApi);
  });

  it('should render footer for alert', () => {
    const { getByTestId } = render(
      <TestProviders>
        <DocumentDetailsContext.Provider value={mockContextValue}>
          <PreviewPanelFooter />
        </DocumentDetailsContext.Provider>
      </TestProviders>
    );
    expect(getByTestId(PREVIEW_FOOTER_TEST_ID)).toBeInTheDocument();
    expect(getByTestId(PREVIEW_FOOTER_TEST_ID)).toHaveTextContent('Show full alert details');
  });

  it('should render footer for event', () => {
    const { getByTestId } = render(
      <TestProviders>
        <DocumentDetailsContext.Provider
          value={{ ...mockContextValue, getFieldsData: () => 'event' }}
        >
          <PreviewPanelFooter />
        </DocumentDetailsContext.Provider>
      </TestProviders>
    );
    expect(getByTestId(PREVIEW_FOOTER_TEST_ID)).toHaveTextContent('Show full event details');
  });

  it('should open document details flyout when clicked', () => {
    const { getByTestId } = render(
      <TestProviders>
        <DocumentDetailsContext.Provider value={mockContextValue}>
          <PreviewPanelFooter />
        </DocumentDetailsContext.Provider>
      </TestProviders>
    );

    getByTestId(PREVIEW_FOOTER_LINK_TEST_ID).click();
    expect(mockFlyoutApi.openFlyout).toHaveBeenCalledWith({
      right: {
        id: DocumentDetailsRightPanelKey,
        params: {
          id: mockContextValue.eventId,
          indexName: mockContextValue.indexName,
          scopeId: mockContextValue.scopeId,
        },
      },
    });
  });
});
