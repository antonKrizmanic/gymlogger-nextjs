import type { Prisma } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import {
	type IWorkoutTemplateSimple,
	mapWorkoutTemplateToIWorkoutTemplate,
} from '../models/domain/workout-template';
import type { IPagedRequest, IPagedResponse } from '../types/common';
import { getLoggedInUser } from './loggedInUser';

export type WorkoutTemplateWhereInput = Prisma.WorkoutTemplateWhereInput;

export const getWorkoutTemplate = async (id: string) => {
	const loggedInUser = await getLoggedInUser();
	if (!loggedInUser) return null;

	const template = await prisma.workoutTemplate.findUnique({
		where: {
			id,
			belongsToUserId: loggedInUser.id,
		},
		include: {
			workoutTemplateExercises: {
				include: {
					exercise: true,
				},
				orderBy: {
					index: 'asc',
				},
			},
		},
	});

	if (!template) return null;

	return mapWorkoutTemplateToIWorkoutTemplate(template);
};

export const getPagedWorkoutTemplates = async (
	pagedRequest: IPagedRequest,
) => {
	const loggedInUser = await getLoggedInUser();
	if (!loggedInUser) return null;

	const where: WorkoutTemplateWhereInput = {
		belongsToUserId: loggedInUser.id,
	};

	if (pagedRequest.search) {
		where.name = {
			contains: pagedRequest.search,
			mode: 'insensitive',
		};
	}

	const totalItems = await prisma.workoutTemplate.count({ where });

	const templates = await prisma.workoutTemplate.findMany({
		where,
		include: {
			workoutTemplateExercises: {
				include: {
					exercise: {
						select: {
							name: true,
						},
					},
				},
				orderBy: {
					index: 'asc',
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
		skip: pagedRequest.page * pagedRequest.pageSize,
		take: pagedRequest.pageSize,
	});

	const mappedTemplates: IWorkoutTemplateSimple[] = templates.map(
		(template) => ({
			id: template.id,
			name: template.name,
			belongsToUserId: template.belongsToUserId,
			createdAt: template.createdAt,
			updatedAt: template.updatedAt,
		}),
	);

	const response: IPagedResponse<IWorkoutTemplateSimple> = {
		pagingData: {
			totalItems,
			page: pagedRequest.page,
			pageSize: pagedRequest.pageSize,
			totalPages: Math.ceil(totalItems / pagedRequest.pageSize),
			search: pagedRequest.search,
			sortColumn: pagedRequest.sortColumn,
			sortDirection: pagedRequest.sortDirection,
		},
		items: mappedTemplates,
	};

	return response;
};
