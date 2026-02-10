"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ShareEmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  demoSlug: string;
  demoTitle: string;
}

export const ShareEmbedDialog = ({ isOpen, onClose, demoSlug, demoTitle }: ShareEmbedDialogProps) => {
  const [embedWidth, setEmbedWidth] = useState('800');
  const [embedHeight, setEmbedHeight] = useState('600');
  const [autoPlay, setAutoPlay] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'embed'>('share');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/demo/${demoSlug}`);
    }
  }, [demoSlug]);

  const embedCode = shareUrl ? `<iframe src="${shareUrl}${autoPlay ? '?autoplay=true' : ''}" width="${embedWidth}" height="${embedHeight}" frameborder="0" allowfullscreen style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>` : '';

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share & Embed
          </AlertDialogTitle>
          <AlertDialogDescription>
            Share your interactive demo or embed it on your website
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('share')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === 'share' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Share Link
            </span>
            {activeTab === 'share' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === 'embed' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Embed Code
            </span>
            {activeTab === 'embed' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'share' ? (
            <motion.div
              key="share"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Share URL */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Public Demo URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl || 'Loading...'}
                    readOnly
                    className="flex-1 font-mono text-sm bg-gray-50"
                  />
                  <Button
                    onClick={() => shareUrl && copyToClipboard(shareUrl, 'Link copied to clipboard! 🎉')}
                    disabled={!shareUrl}
                    className="cursor-pointer whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Anyone with this link can view your demo
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-sm font-semibold mb-3 text-gray-900">Link Preview</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 truncate">{demoTitle}</h5>
                      <p className="text-sm text-gray-500 truncate">{shareUrl}</p>
                      <p className="text-xs text-gray-400 mt-1">Interactive product demo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Share Options */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Share on Social Media</Label>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!shareUrl) return;
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(demoTitle)}&url=${encodeURIComponent(shareUrl)}`;
                      window.open(twitterUrl, '_blank');
                    }}
                    disabled={!shareUrl}
                    className="cursor-pointer flex-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!shareUrl) return;
                      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                      window.open(linkedInUrl, '_blank');
                    }}
                    disabled={!shareUrl}
                    className="cursor-pointer flex-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!shareUrl) return;
                      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                      window.open(facebookUrl, '_blank');
                    }}
                    disabled={!shareUrl}
                    className="cursor-pointer flex-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="embed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Embed Options */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Width (px)</Label>
                  <Input
                    type="number"
                    value={embedWidth}
                    onChange={(e) => setEmbedWidth(e.target.value)}
                    min="300"
                    max="2000"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Height (px)</Label>
                  <Input
                    type="number"
                    value={embedHeight}
                    onChange={(e) => setEmbedHeight(e.target.value)}
                    min="200"
                    max="1500"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Auto-play</Label>
                  <div className="flex items-center h-10">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoPlay}
                        onChange={(e) => setAutoPlay(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {autoPlay ? 'On' : 'Off'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Embed Code</Label>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 pr-24 rounded-lg text-xs font-mono overflow-x-auto border border-gray-700 max-h-32 whitespace-pre-wrap break-all">
                    {embedCode || 'Loading...'}
                  </pre>
                  <Button
                    size="sm"
                    onClick={() => embedCode && copyToClipboard(embedCode, 'Embed code copied! 🎉')}
                    disabled={!embedCode}
                    className="absolute top-2 right-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Code
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Paste this code into your website's HTML to embed the demo
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-sm font-semibold mb-3 text-gray-900 flex items-center justify-between">
                  <span>Embed Preview</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {embedWidth}×{embedHeight}px
                  </span>
                </h4>
                <div className="w-full max-w-full overflow-hidden">
                  <div 
                    className="bg-white rounded-lg border border-gray-300 overflow-hidden mx-auto"
                    style={{ 
                      width: '100%',
                      maxWidth: '600px',
                      height: '300px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center px-4">
                        <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-semibold opacity-90 truncate">
                          {demoTitle}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          Interactive Demo Preview
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How to use
                </h5>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Copy the embed code above</li>
                  <li>• Paste it into your website's HTML where you want the demo to appear</li>
                  <li>• The demo will be fully interactive and responsive</li>
                  <li>• Customize width, height, and auto-play options as needed</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
