---
layout: post
title: "Phantom Hits & Transition States"
---

<p>I am using a Hermes-like architecture to predict off-chip page walk accesses. The architecture predicts whether a page walk will go off-chip in search of the next page table address. Two packets are sent: one regular (<abbr title="regular">reg</abbr>) and one special (<abbr title="DRAM prefetch">ddrp</abbr>) packet.</p>
<p>A page table entry holding a page address is 8 bytes, so a 64-byte cache block holds eight entries. A page is allocated by the page fault mechanism and its address is stored in another page that is part of the page table. When a requested page has just been allocated, the cache block holding its page table entry has one valid 8-byte entry while the remaining seven entries are invalid.</p>
<p>The next access to the same cache block is a cache hit because the tag matches, but it may request one of the seven entries that has not yet been allocated. The hardware reads the entry and brings it to the MMU during the page walk. The MMU checks the valid bit in the entry, determines that it is invalid, and sends a page fault signal to the operating system. The operating system then allocates a page and sends the missing 8-byte entry rather than transferring the whole 64-byte block to the cache.</p>
<p>In my simulator I do not carry the block-level information with a page table request. Instead, I use a central structure that looks up the page number, block ID, and entry index to satisfy cache read requests for translation blocks. Each 8-byte entry has its page-fault flag set to 1 by default. When the fault is read, I allocate the page, update the entry with the page address, and reset the flag to 0.</p>
<p>While modeling regular and ddrp requests, I found that the ddrp request, which moves ahead of the regular request, resets the page-fault flag to 0. Because the block in the cache shares the central structure, that change is immediately reflected there. The regular request should see page-fault=1, but instead sees the value reset by ddrp. This inconsistency increases the false-positive rate of the predictor and lowers its precision.</p>
<p>The problem became clear when I built an oracle predictor that knows whether an access will go off-chip. It looks through all caches, and if the data is absent, sends a ddrp request to the DRAM controller to prefetch the page-table block. The oracle correctly predicts an off-chip access, but the ddrp packet resets page-fault=0. The regular packet then sees both a cached block and a valid entry, reports a hit instead of a forced miss, and incorrectly trains the predictor as a false positive.</p>
<p>To solve this problem, I introduced a transition state (<abbr title="transition state">TS</abbr>) for the page-fault (<abbr title="page fault">PF</abbr>) flag.</p>

<h3>Rules at DRAM</h3>
<ol>
  <li>PF=1 and ddrp packet: PF becomes TS.</li>
  <li>PF=1 and regular packet: PF becomes 0.</li>
  <li>PF=0 and ddrp or regular packet: no change.</li>
  <li>PF=TS and ddrp packet: no change.</li>
  <li>PF=TS and regular packet: PF becomes 0.</li>
</ol>
