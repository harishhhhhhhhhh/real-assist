import { NextRequest, NextResponse } from 'next/server';
import { indexDocuments } from '../../../scripts/indexDocuments';

export async function GET(req: Request) {
    try {
        await indexDocuments();
        return NextResponse.json({ message: 'Documents indexed successfully.' });
    } catch (error) {
        console.error('Error indexing documents:', error);
        return NextResponse.json({ message: 'Error indexing documents.' }, { status: 500 });
    }
}




