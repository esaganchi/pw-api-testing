import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';

let apiLogger: APILogger

export const setCustomExpectLogger = (logger: APILogger) => {
    apiLogger = logger;
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R;
            shouldBeLessThanOrEqual(expected: T): R;
        }
    }
}

export const expect = baseExpect.extend({
    shouldEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string = '';
      
        // Получаем логи всегда, чтобы они были доступны в сообщении об ошибке
        logs = apiLogger ? apiLogger.getRecentLogs() : '';
      
        try {
          baseExpect(received).toEqual(expected);
          pass = true;
        } catch (e: any) {
          pass = false;
        }
      
        const hint = this.isNot ? 'not ' : '';
        const message =
          this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Expected: ${hint}${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}` +
          (logs ? `\n\nRecent API Activity:\n${logs}` : '')

        return {
            message: () => message,
            pass,
        };
    },
    shouldBeLessThanOrEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string = '';
      
        // Получаем логи всегда, чтобы они были доступны в сообщении об ошибке
        logs = apiLogger ? apiLogger.getRecentLogs() : '';
      
        try {
          baseExpect(received).toBeLessThanOrEqual(expected);
          pass = true;
        } catch (e: any) {
          pass = false;
        }
      
        const hint = this.isNot ? 'not ' : '';
        const message =
          this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Expected: ${hint}${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}` +
          (logs ? `\n\nRecent API Activity:\n${logs}` : '')

        return {
            message: () => message,
            pass,
        };
    }
});