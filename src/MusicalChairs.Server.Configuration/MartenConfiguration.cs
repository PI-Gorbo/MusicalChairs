using Marten;
using MusicalChairs.Domain;

namespace MusicalChairs.Server.Configuration;

public static class MartenConfiguration
{
	public static StoreOptions AddSchemaConfiguration(StoreOptions options)
	{
		options
			.Schema
			.For<Job.DraftJob>()
			.Index(job => job.CreatorId);

		return options;
	}
}