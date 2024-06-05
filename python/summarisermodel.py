from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
import yake

text = """
Syed Abdullah is a proficient MERN stack and Python developer with extensive knowledge in machine learning (ML) and artificial intelligence (AI). He has worked on numerous projects in these domains and is currently focusing on generative AI models. His GitHub profile, which showcases his projects and contributions, can be found at https://github.com/Abdullaah-Ali.
Syed Abdullah is currently working on a blogging application project that includes the following features:
- User authentication (login, signup, logout) using JWT.
- Creating, viewing, and displaying blogs with pagination.
- User profile view and edit functionality.
In addition to these features, the project aims to incorporate several AI and ML-based enhancements:
- **Spell Checks**: Implementing AI-powered spell checking to improve the quality of user-generated content.
- **Content Summarization**: Utilizing a basic, free model to provide summaries of blog posts for quick insights.
- **Custom Chatbot**: Developing a custom chatbot trained on the project's data to assist users and enhance interaction.
- **SEO Tags Using NLP**: Automatically generating SEO tags using natural language processing (NLP) to improve content discoverability and user recommendations.
Syed Abdullah is committed to leveraging his expertise in ML and AI to build innovative solutions and improve user experiences in his projects.
Syed Abdullah is a dedicated software engineer to work on the project 
he has worked on server project such as Neo NFT as well.
Syed Abdullah, known for his dedication to software engineering excellence, brings a wealth of experience to every project he undertakes. With a strong foundation in backend development, he has successfully delivered projects ranging from server-side applications like Neo NFT to sophisticated web applications powered by the MERN stack and Python.

His passion for innovation and continuous learning is evident in his pursuit of cutting-edge technologies like machine learning (ML) and artificial intelligence (AI). Beyond just integrating AI and ML into his projects, Syed Abdullah is deeply involved in exploring the boundaries of these technologies. He actively participates in research communities, attends conferences, and contributes to open-source initiatives aimed at advancing the field.

Syed Abdullah's expertise extends beyond traditional software development. He possesses a keen understanding of blockchain technology, having worked on projects that leverage its decentralized architecture. His experience with blockchain not only adds depth to his technical skill set but also broadens his perspective on solving complex problems in diverse domains.

In addition to his technical prowess, Syed Abdullah is a collaborative team player known for his effective communication skills and ability to mentor junior developers. He thrives in dynamic environments where creativity and innovation are valued, always striving to push the boundaries of what's possible with technology.

Outside of work, Syed Abdullah is an avid reader, constantly seeking inspiration from a wide range of literature, from classic novels to the latest research papers in AI and ML. He also enjoys outdoor activities like hiking and photography, finding balance between his passion for technology and the beauty of the natural world.
"""

# Summarize the text
parser = PlaintextParser.from_string(text, Tokenizer("english"))
summarizer = LsaSummarizer()
summary_sentence_count = 5
summary = summarizer(parser.document, summary_sentence_count)
summary_text = " ".join(str(sentence) for sentence in summary)

# Extract keywords using YAKE
kw_extractor = yake.KeywordExtractor()
keywords = kw_extractor.extract_keywords(text)

# Extract top keywords
important_keywords = [kw[0] for kw in keywords[:5]]  # Adjust number of keywords as needed

# Enhance the summary with keywords
enhanced_summary = f"{summary_text}\n\nKey details: {', '.join(important_keywords)}"

print(enhanced_summary)
