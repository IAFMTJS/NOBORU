-- Dedupe は/です grammar: merge です (desu) → です, remove Base Camp duplicate, set act_index.

do $$
declare
  canonical_desu uuid;
  duplicate_desu uuid;
  base_region uuid;
  first_sentences_lesson uuid;
  g_wa uuid;
  g_desu uuid;
  n5_region uuid;
begin
  select id into canonical_desu from public.grammar_points where title = 'です' limit 1;
  select id into duplicate_desu from public.grammar_points where title = 'です (desu)' limit 1;

  if duplicate_desu is not null then
    if canonical_desu is null then
      update public.grammar_points
      set title = 'です', updated_at = now()
      where id = duplicate_desu;
      canonical_desu := duplicate_desu;
    elsif duplicate_desu <> canonical_desu then
      update public.lesson_items
      set content_id = canonical_desu, updated_at = now()
      where content_type = 'grammar' and content_id = duplicate_desu;

      delete from public.grammar_points where id = duplicate_desu;
    end if;
  end if;

  select id into g_wa from public.grammar_points where title = 'は (wa)' limit 1;
  select id into g_desu from public.grammar_points where title = 'です' limit 1;

  select id into base_region from public.regions where slug = 'base-camp' limit 1;
  if base_region is not null and g_wa is not null and g_desu is not null then
    select l.id into first_sentences_lesson
    from public.lessons l
    inner join public.units u on u.id = l.unit_id
    where u.region_id = base_region
      and l.title = 'First Sentences'
    limit 1;

    if first_sentences_lesson is not null then
      delete from public.lesson_items
      where lesson_id = first_sentences_lesson
        and content_type = 'grammar'
        and content_id in (g_wa, g_desu);

      update public.lessons
      set
        title = 'Grammar Preview',
        description = 'Quick orientation — full は/です patterns live in Sentence Foundations on the N5 trail.',
        status = 'draft',
        updated_at = now()
      where id = first_sentences_lesson;
    end if;
  end if;

  select id into n5_region
  from public.regions
  where slug in ('n5', 'mount-n5')
  order by case when slug = 'n5' then 0 else 1 end
  limit 1;

  if n5_region is not null then
    update public.units
    set act_index = 2, updated_at = now()
    where region_id = n5_region and name = 'Sentence Foundations';
  end if;
end $$;
