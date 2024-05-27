import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOneOrFail: jest.fn((entity) => entity),
    insert: jest.fn((entity) => entity),
    findAndCount: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  }),
);
