import { Parent, PhrasingContent } from 'mdast';

export interface Mark extends Parent {
    type: 'delete';
    children: PhrasingContent[];
}

declare module 'mdast' {
    interface StaticPhrasingContentMap {
        mark: Mark;
    }
}
