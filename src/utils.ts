export function find_all_unique_tags(
	text:string,
	openDelimiter: string,
	closeDelimiter: string,
	tags: string[] = []): string[]
{
	const openIndex: number = text.indexOf(openDelimiter);
	const closeIndex: number = text.indexOf(closeDelimiter);

	// Base case
	if (openIndex === -1 || closeIndex === -1) {
		return tags;
	}

	const tag = text.substring(openIndex + openDelimiter.length, closeIndex);
	if (!tags.includes(tag)) {
		tags.push(tag);
	}
	const remainingText = text.substring(closeIndex + closeDelimiter.length);
	return find_all_unique_tags(remainingText, openDelimiter, closeDelimiter, tags)
}

export function find_and_replace_all_tags(
	text: string, 
	openDelimiter: string, 
	closeDelimiter: string, 
	tags: Record<string, string>,
	): string
{
	const openIndex: number = text.indexOf(openDelimiter);
	const closeIndex: number = text.indexOf(closeDelimiter);

	// Base case
	if (openIndex === -1 || closeIndex === -1) {
		return text
	}

	const tag = text.substring(openIndex + openDelimiter.length, closeIndex);
	const tagFound: boolean = tags[tag] !== undefined;

	// Remove delimiters and return text with next tag replaced
	const unchangedText = text.substring(0, openIndex);
	const newText = tagFound ? tags[tag] : "TAG_NOT_FOUND";

	const reachedEndOfText = closeIndex + closeDelimiter.length === text.length;
	const remainingText = reachedEndOfText ? "" : text.substring(closeIndex + closeDelimiter.length);

	const returnText = unchangedText + newText + remainingText;
	console.log(returnText);
	return find_and_replace_all_tags(returnText, openDelimiter, closeDelimiter, tags);
}