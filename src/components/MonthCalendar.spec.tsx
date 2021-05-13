import MonthCalendar from './MonthCalendar';
import { mountWithProviders } from '../utils/testing';
import { ZetkinEvent } from '../types/zetkin';

describe('MonthCalendar', () => {
    let dummyMonth : number;
    let dummyYear: number;
    let dummyEvents: ZetkinEvent[];
    const dummyStartTime = '2021-05-10T13:37:00+00:00';
    const dummyEndTime = '2021-05-10T14:37:00+00:00';

    beforeEach(() => {
        dummyMonth = 4;
        dummyYear = 2021;
        cy.fixture('dummyEvents.json')
            .then((data: { data: ZetkinEvent[] }) => {
                dummyEvents = data.data;
                dummyEvents[0].start_time = dummyStartTime;
                dummyEvents[0].end_time = dummyEndTime;
                dummyEvents[1] = {
                    ...dummyEvents[0],
                    'end_time': '2021-05-10T17:37:00+00:00',
                    'id': 25,
                    'start_time': '2021-05-10T15:37:00+00:00',
                };
                dummyEvents[3] = {
                    ...dummyEvents[0],
                    'end_time': '2021-04-27T17:37:00+00:00',
                    'id': 24,
                    'start_time': '2021-04-27T15:37:00+00:00',
                };
            });
    });

    it('shows a grid with 6 rows and 7 columns', () => {
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );
        cy.get('[data-testid="calendar-wrapper"]').should('have.css', 'display', 'grid');
        cy.get('[data-testid="calendar-wrapper"]').children().should('have.length', 42);
        cy.get('[data-testid="griditem-0"]').then(el => {
            const topLeft = el[0].getBoundingClientRect().left;
            cy.get('[data-testid="griditem-6"]').then(el => {
                const topRight = el[0].getBoundingClientRect().left;
                cy.get('[data-testid="griditem-35"]').then(el => {
                    const bottomLeft = el[0].getBoundingClientRect().left;
                    cy.get('[data-testid="griditem-41"]').then(el => {
                        const bottomRight = el[0].getBoundingClientRect().left;
                        expect(topLeft).to.eq(bottomLeft);
                        expect(topRight).to.eq(bottomRight);
                    });
                });
            });
        });
    });

    it('displays the correct date on each grid square', () => {
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );
        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-35"]').contains('31');
    });

    it('displays the correct events on the corresponding date', () => {
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );
        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-35"]').contains('31');
    });

    it('shows out of range dates with another colour', () => {
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );

        cy.get('[data-testid="griditem-4"]').then(el => {
            const beforeRangeBackgroundColor = el[0].style.backgroundColor;
            cy.get('[data-testid="griditem-36"]').then(el => {
                const afterRangeBackgroundColor = el[0].style.backgroundColor;
                cy.get('[data-testid="griditem-20"]').then(el => {
                    const inRangeBackgroundColor = el[0].style.backgroundColor;
                    expect(inRangeBackgroundColor).to.not.eq(beforeRangeBackgroundColor);
                    expect(afterRangeBackgroundColor).to.eq(beforeRangeBackgroundColor);
                });
            });
        });
    });

    it('works with a month exactly 4 weeks long starting on Monday', () => {
        dummyMonth = 1;
        dummyYear = 2021;
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );
        cy.get('[data-testid="griditem-0"]').contains('01');
        cy.get('[data-testid="griditem-27"]').contains('28');
    });

    it('works with a leap year february', () => {
        dummyMonth = 1;
        dummyYear = 2020;
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );
        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-33"]').contains('29');
    });

    it('works across year boundaries', () => {
        dummyMonth = 11;
        dummyYear = 2020;
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );
        cy.get('[data-testid="griditem-1"]').contains('01');
        cy.get('[data-testid="griditem-31"]').contains('31');
    });

    it('displays events in chronological order within a day', () => {
        mountWithProviders(
            <MonthCalendar events={ dummyEvents } month={ dummyMonth } year={ dummyYear } />,
        );
        cy.get('[data-testid="event-26"]').then(el => {
            const firstEventYPos = el[0].getBoundingClientRect().top;
            cy.get('[data-testid="event-25"]').then(el => {
                const secondEventYPos = el[0].getBoundingClientRect().top;
                expect(firstEventYPos).to.be.lessThan(secondEventYPos);
            });
        });
    });
});