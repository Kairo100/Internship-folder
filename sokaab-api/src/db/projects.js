import db from './index';

export const getExploreProjects = async () => {
  let subquery = db()('Project_accounts as pa')
    .innerJoin('Projects', 'Projects.project_id', 'pa.project_id')
    .innerJoin('Receipts as r', 'r.AccNo', 'pa.accNo')
    .select(
      'pa.project_id',
      db().raw('COUNT(*) AS Total'),
      db().raw(
        "SUM(CASE WHEN (r.Category IS NULL OR r.Category != 'MATCHING FUND') AND r.DrCr = 'cr' THEN r.TranAmt ELSE 0 END) AS raised_amount",
      ),
      db().raw(
        "SUM(CASE WHEN (r.Category = 'EXPENDITURE') AND r.DrCr = 'dr' THEN r.TranAmt ELSE 0 END) AS expenditure",
      ),
    )
    .groupBy('pa.project_id')
    .as('t');

  const rows = await db()
    .select(
      'p.project_id as id',
      'p.title',
      'p.entity_id',
      'p.category',
      'p.community_name',
      'p.project_value',
      'p.funding_goal',
      'p.available_grant',
      'p.status',
      'p.date_time_added',
      'p.location_district',
      'p.end_date',
      'p.implementation_start_date',
      'p.implementation_end_date',
      db().raw('ISNULL(t.Total, 0) AS total_backers'),
      db().raw('ISNULL(t.raised_amount, 0) AS raised_amount'),
      db().raw('ISNULL(t.expenditure, 0) AS expenditure'),
      'pi.image_name_1',
      'pi.url_1',
      'pi.image_name_2',
      'pi.url_2',
      'pi.image_name_3',
      'pi.url_3',
    )
    .from('Projects as p')
    .leftJoin(subquery, 'p.project_id', 't.project_id')
    .leftJoin('project_images as pi', 'p.project_id', 'pi.project_id')
    .where('p.entity_id', 2)
    .andWhere('p.status', 'Live');

  let all_projects = {
    alphabetical: [],
    latest: [],
    oldest: [],
    top_donation: [],
  };

  all_projects.alphabetical = [...rows].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  all_projects.latest = [...rows].sort(
    (a, b) =>
      new Date(Date.parse(b.date_time_added)) -
      new Date(Date.parse(a.date_time_added)),
  );

  all_projects.oldest = [...rows].sort(
    (a, b) =>
      new Date(Date.parse(a.date_time_added)) -
      new Date(Date.parse(b.date_time_added)),
  );

  // Sort rows based on top donation
  all_projects.top_donation = [...rows].sort(
    (a, b) => b.raised_amount - a.raised_amount,
  );

  return all_projects;
};
