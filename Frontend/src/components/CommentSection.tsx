import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageCircle, Heart, Reply } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  likes: number;
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Alex Johnson",
      content: "This really resonated with me! I've been struggling with this exact issue and your perspective has given me a new way to think about it.",
      date: "2 days ago",
      likes: 5
    },
    {
      id: 2,
      author: "Maria Garcia",
      content: "Such a thoughtful piece. The practical examples really help bring the concepts to life. Can't wait to try these strategies!",
      date: "5 days ago",
      likes: 3
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && name.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: name,
        content: newComment,
        date: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setName('');
      setShowForm(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="bg-[#FFFEF9] rounded-2xl p-8 md:p-12 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-[#D2691E]" />
          <h3 
            className="text-2xl md:text-3xl text-[#3C2415]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Comments ({comments.length})
          </h3>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#D2691E] hover:bg-[#B8581A] text-white"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Add Comment
        </Button>
      </div>

      {/* Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-[#FAF7F2] rounded-xl p-6 space-y-4">
              <div>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-[#E8D5B7] focus:border-[#D2691E] text-[#3C2415]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="bg-white border-[#E8D5B7] focus:border-[#D2691E] text-[#3C2415] resize-none"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-[#D2691E] hover:bg-[#B8581A] text-white"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Post Comment
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setNewComment('');
                    setName('');
                  }}
                  className="border-[#E8D5B7] text-[#8B4513] hover:bg-[#F5E6D3]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-[#FAF7F2] rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 bg-[#D2691E] flex-shrink-0">
                <AvatarFallback className="bg-[#D2691E] text-white text-sm">
                  {getInitials(comment.author)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 
                    className="text-[#3C2415]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {comment.author}
                  </h4>
                  <span 
                    className="text-sm text-[#8B4513]"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    {comment.date}
                  </span>
                </div>
                
                <p 
                  className="text-[#3C2415] mb-4 leading-relaxed"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {comment.content}
                </p>
                
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-[#8B4513] hover:text-[#D2691E] transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {comment.likes}
                    </span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-[#8B4513] hover:text-[#D2691E] transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      Reply
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {comments.length === 0 && !showForm && (
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-[#E8D5B7] mx-auto mb-4" />
          <p 
            className="text-[#8B4513]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
}
