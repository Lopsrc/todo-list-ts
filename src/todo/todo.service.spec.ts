import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const todos = [
	{
		id: 1,
		user_id: 1,
		created_at: new Date(),
		title: 'Task 1',
		description: 'This is task 1',
		progress_id: 1,
		position: 1,
		completed: false,
	},
	{
		id: 2,
		user_id: 1,
		created_at: new Date(),
		title: 'Task 2',
		description: 'This is task 2',
		progress_id: 1,
		position: 2,
		completed: false,
	},

];

const db = {
	projects: {
		findMany: jest.fn().mockResolvedValue(todos),
		findUnique: jest.fn().mockResolvedValue(todos[0]),
		findFirst: jest.fn().mockResolvedValue(todos[0]),
		create: jest.fn().mockReturnValue(todos[0]),
		save: jest.fn(),
		update: jest.fn().mockResolvedValue(todos[0]),
		delete: jest.fn().mockResolvedValue(todos[0]),
		$transaction: jest.fn().mockResolvedValue(todos[0]),
	},
	$transaction: jest.fn().mockResolvedValue(todos[0]),
	users: {
        findUnique: jest.fn().mockResolvedValue({ id: 1 , refresh_token_hash: 'some_token', role: 'ADMIN'}),
    },
};

describe('TodoService', () => {
	let service: TodoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				TodoService,
				{
					provide: PrismaService,
					useValue: db,
				},
			],
		}).compile();
	
		service = module.get<TodoService>(TodoService);
	
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('createTodo', () => {
		it('should create a new todo', async () => {
            const result = await service.createTodo(1, {
                name: 'some name',
				progress_id: 1,
			});
			expect(result).toEqual(todos[0]);
        });
	});

	describe('getAllTodos', () => {
		it('should return all todos', async () => {
			const result = await service.getAllTodos(0);
			expect(result).toEqual(todos);
		});
	});

	describe('getTodos', () => {
		it('should return all todos for a user', async () => {
            const result = await service.getTodos(0);
            expect(result).toEqual(todos);
        });
	});

	describe('updateTodo', () => {
		it('should update a todo', async () => {
            const result = await service.updateTodo(0, {
                id: 1,
                name: 'updated name',
                progress_id: 1,
            });
            expect(result).toEqual(todos[0]);
        });
	});

	describe('updatePositionOfTodo', () => {
		it('should update position of a todo', async () => {
            const result = await service.updatePositionOfTodo(0, {
                user_id: 1,
                oldPosition: 1,
                newPosition: 2,
            });
            expect(result).toEqual(todos);
        });
	});

	describe('deleteTodo', () => {
		it('should delete a todo', async () => {
            const result = await service.deleteTodo(0, 1);
            expect(result).toBeTruthy();
        });
	});

	// afterAll(async () => {
    //     jest.clearAllMocks();
    // });
});
