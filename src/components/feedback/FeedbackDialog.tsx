import { useState } from 'react';
import { Star } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/lib/supabase';

interface FeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId?: string;
}

export function FeedbackDialog({ open, onOpenChange, userId }: FeedbackDialogProps) {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comments, setComments] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Rating required', {
                description: 'Please select a star rating before submitting.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('feedback').insert({
                rating,
                comments: comments.trim() || null,
                email: email.trim() || null,
                user_id: userId || null,
            });

            if (error) throw error;

            toast.success('Thank you for your feedback!', {
                description: 'We appreciate you taking the time to share your thoughts.',
            });

            // Reset form and close dialog
            setRating(0);
            setComments('');
            setEmail('');
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Submission failed', {
                description: 'There was an error submitting your feedback. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setRating(0);
        setComments('');
        setEmail('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Share Your Feedback</DialogTitle>
                    <DialogDescription>
                        Help us improve! Your feedback is valuable to us.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Rating <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-all hover:scale-110 focus:outline-none focus:opacity-80 rounded-sm"
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-muted-foreground'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-xs text-muted-foreground">
                                You rated: {rating} star{rating !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <Label htmlFor="comments" className="text-sm font-medium">
                            Comments <span className="text-muted-foreground text-xs">(optional)</span>
                        </Label>
                        <Textarea
                            id="comments"
                            placeholder="Tell us what you think..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email <span className="text-muted-foreground text-xs">(optional)</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            We'll only use this to follow up on your feedback if needed.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
