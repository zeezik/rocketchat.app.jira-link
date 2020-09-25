import { ILogger } from "@rocket.chat/apps-engine/definition/accessors";
import { expect } from "chai";
import "mocha";
import { Mock } from "typemoq";
// tslint:disable:no-unused-expression

import { JiraConnection } from "../src/jiraConnection/jiraConnection";
import { IJiraIssue, ISSUE_URL_PREFIX, JiraIssueProvider } from "../src/jiraConnection/jiraIssueProvider";

describe("Jira Issue Provider Tests", () => {
    it("Failed request should return undefined", async () => {
        // Arrange
        const issueId = "PRJ-123";
        const requestUrl = ISSUE_URL_PREFIX + issueId;
        const logger = Mock.ofType<ILogger>();
        const jiraConnectionMock = Mock.ofType<JiraConnection>();
        jiraConnectionMock.setup(jc => jc.request(requestUrl)).throws(new Error());

        const cut = new JiraIssueProvider(jiraConnectionMock.object, logger.object);

        // Act

        const result = await cut.getIssue(issueId);

        // Assert
        expect(result).to.be.undefined;
    });

    it("Valid request should return issue", async () => {
        // Arrange
        const issueId = "PRJ-123";
        const requestUrl = ISSUE_URL_PREFIX + issueId;
        const logger = Mock.ofType<ILogger>();
        const jiraConnectionMock = Mock.ofType<JiraConnection>();
        jiraConnectionMock.setup(jc => jc.request<IJiraIssue>(requestUrl))
            .returns(async () => {
                return { key: issueId } as IJiraIssue;
            });

        const cut = new JiraIssueProvider(jiraConnectionMock.object, logger.object);

        // Act
        const result = await cut.getIssue(issueId) as IJiraIssue;

        expect(result.key).to.equal(issueId);
    });
});
