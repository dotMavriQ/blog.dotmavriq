import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostData, getAllPostIds } from "../../../lib/posts";
import { Metadata } from "next";
import ShareButton from "../../../components/ShareButton";

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const post = await getPostData(params.id);
    return {
      title: `${post.title} | dotMavriQ Blog`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Blog Post Not Found | dotMavriQ",
      description: "The requested blog post could not be found.",
    };
  }
}

// Generate static paths for all blog posts
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
    const posts = await getAllPostIds();
    return posts.map(post => post.params);
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPost(props: { params: { id: string } }) {
  const { params } = props;
  try {
    const post = await getPostData(params.id);

    return (
      <div className="flex flex-col min-h-screen p-6 md:p-8 bg-[#282828] text-[#ebdbb2]">
        <Link
          href="/blog"
          className="mb-8 flex items-center text-[#83a598] hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to all posts
        </Link>

        <article className="w-full max-w-4xl mx-auto bg-[#32302f] p-6 md:p-8 rounded-lg shadow-lg border border-[#504945]">
          <header className="mb-8 border-b border-[#504945] pb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#fabd2f]">
              {post.title}
            </h1>

            <time
              dateTime={new Date(post.date).toISOString()}
              className="text-sm text-[#a89984] block mb-4"
            >
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                >
                  <span className="px-3 py-1 bg-[#504945] text-[#fbf1c7] rounded-full text-xs hover:bg-[#665c54] transition-colors">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>

            <p className="text-lg md:text-xl text-[#d5c4a1] italic border-l-4 border-[#504945] pl-4 py-2">
              {post.excerpt}
            </p>
          </header>

          {/* Blog post content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-[#fabd2f]
              prose-h1:text-3xl prose-h1:font-bold
              prose-h2:text-2xl prose-h2:font-semibold
              prose-h3:text-xl prose-h3:font-semibold
              prose-p:text-[#ebdbb2] prose-p:leading-relaxed
              prose-a:text-[#83a598] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#fe8019] prose-strong:font-bold
              prose-em:text-[#b8bb26] prose-em:italic
              prose-code:text-[#fb4934] prose-code:bg-[#3c3836] prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-[#3c3836] prose-pre:text-[#ebdbb2] prose-pre:p-4 prose-pre:rounded-lg
              prose-blockquote:border-l-4 prose-blockquote:border-[#b16286] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#d3869b]
              prose-ul:text-[#ebdbb2] prose-ol:text-[#ebdbb2]
              prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        <div className="w-full max-w-4xl mx-auto mt-8 flex justify-between">
          <Link
            href="/blog"
            className="px-4 py-2 bg-[#504945] text-[#ebdbb2] rounded-md hover:bg-[#665c54] transition-colors"
          >
            Back to Blog
          </Link>

          <div className="flex gap-4">
            <ShareButton postTitle={post.title} />
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}